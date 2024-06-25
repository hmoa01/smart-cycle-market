import { RequestHandler } from "express";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import imagekit from "src/cloud";
import fs from "fs";
import ProductModel from "src/models/product";
import { sendErrorRes } from "src/utils/helper";
import { isValidObjectId } from "mongoose";
import { UserDocument } from "src/models/user";
import categories from "src/utils/categories";

const uploadImage = (filepath: string): Promise<UploadResponse> => {
  return imagekit.upload({
    file: fs.readFileSync(filepath),
    fileName: filepath,
    folder: "products",
  });
};

export const listNewProduct: RequestHandler = async (req, res) => {
  const { name, price, category, description, purchasingDate } = req.body;
  const newProduct = new ProductModel({
    owner: req.user.id,
    name,
    price,
    category,
    description,
    purchasingDate,
  });

  const { images } = req.files;

  const isMultipleImages = Array.isArray(images);

  if (isMultipleImages && images.length > 5) {
    return sendErrorRes(res, "Image files can not be more then 5!", 400);
  }

  let invalidFileType = false;

  if (isMultipleImages) {
    for (let img of images) {
      if (!img.mimetype?.startsWith("image")) {
        invalidFileType = true;
        break;
      }
    }
  } else {
    if (!images.mimetype?.startsWith("image")) {
      invalidFileType = true;
    }
  }

  if (invalidFileType) {
    return sendErrorRes(
      res,
      "Invalid file type, files must be image type!",
      422
    );
  }

  // FILE UPLOAD

  if (isMultipleImages) {
    const uploadPromise = images.map((file) => uploadImage(file.filepath));
    const uploadResults = await Promise.all(uploadPromise);
    newProduct.images = uploadResults.map(({ url, fileId }) => {
      return { url, id: fileId };
    });

    newProduct.thumbnail = uploadResults[0].url;
  } else {
    if (images) {
      const { url, fileId } = await uploadImage(images.filepath);
      newProduct.images = [{ url, id: fileId }];
      newProduct.thumbnail = url;
    }
  }

  await newProduct.save();

  res.status(201).json({
    message: "Product created successfully!",
    product: newProduct,
  });
};

export const updateProduct: RequestHandler = async (req, res) => {
  const { name, price, category, description, purchasingDate, thumbnail } =
    req.body;

  const { id } = req.params;
  if (!isValidObjectId(id))
    return sendErrorRes(res, "Invalid product id!", 422);

  const product = await ProductModel.findOneAndUpdate(
    { _id: id, owner: req.user.id },
    { name, price, category, description, purchasingDate },
    { new: true }
  );
  if (!product) return sendErrorRes(res, "Product not found!", 404);

  if (product.images!.length >= 5) {
    return sendErrorRes(res, "Product already has 5 images!", 422);
  }

  if (typeof thumbnail === "string") {
    product.thumbnail = thumbnail;
  }

  const { images } = req.files;

  const isMultipleImages = Array.isArray(images);

  if (isMultipleImages) {
    const oldImages = product.images?.length || 0;
    if (oldImages + images.length > 5) {
      return sendErrorRes(res, "Image files can not be more then 5!", 400);
    }
  }

  let invalidFileType = false;

  if (isMultipleImages) {
    for (let img of images) {
      if (!img.mimetype?.startsWith("image")) {
        invalidFileType = true;
        break;
      }
    }
  } else {
    if (!images.mimetype?.startsWith("image")) {
      invalidFileType = true;
    }
  }

  if (invalidFileType) {
    return sendErrorRes(
      res,
      "Invalid file type, files must be image type!",
      422
    );
  }

  // FILE UPLOAD

  if (isMultipleImages) {
    const uploadPromise = images.map((file) => uploadImage(file.filepath));
    const uploadResults = await Promise.all(uploadPromise);
    const newImages = uploadResults.map(({ url, fileId }) => {
      return { url, id: fileId };
    });
    if (product.images) product.images.push(...newImages);
    else product.images = newImages;
  } else {
    if (images) {
      const { url, fileId } = await uploadImage(images.filepath);
      if (product.images) product.images.push({ url, id: fileId });
      else product.images = [{ url, id: fileId }];
    }
  }

  await product.save();

  res.status(201).json({
    message: "Product created successfully!",
    product: product,
  });
};

export const deleteProduct: RequestHandler = async (req, res) => {
  console.log(req.user);
  const productId = req.params.id;
  if (!isValidObjectId(productId)) {
    return sendErrorRes(res, "Invalid product id", 422);
  }

  const product = await ProductModel.findOneAndDelete({
    _id: productId,
    owner: req.user.id,
  });

  if (!product) {
    return sendErrorRes(res, "Product not find!", 404);
  }

  const images = product.images || [];
  if (images.length) {
    const ids = images?.map(({ id }) => id);
    await imagekit.bulkDeleteFiles(ids!);
  }

  res.json({ message: "Product removed successfully!" });
};

export const deleteProductImage: RequestHandler = async (req, res) => {
  const { productId, imageId } = req.params;
  if (!isValidObjectId(productId)) {
    return sendErrorRes(res, "Invalid product id", 422);
  }

  const product = await ProductModel.findOneAndUpdate(
    { _id: productId, owner: req.user.id },
    {
      $pull: {
        images: { id: imageId },
      },
    },
    { new: true }
  );

  if (!product) {
    return sendErrorRes(res, "Product not find!", 404);
  }

  if (product.thumbnail?.includes(imageId)) {
    const images = product.images;
    if (images) product.thumbnail = images[0].url;
    else product.thumbnail = "";
    await product.save();
  }

  await imagekit.deleteFile(imageId);

  res.json({ message: "Image removed successfully." });
};

export const getProductDetail: RequestHandler = async (req, res) => {
  console.log(req.user);
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return sendErrorRes(res, "Invalid product id", 422);
  }

  const product = await ProductModel.findById(id).populate<{
    owner: UserDocument;
  }>("owner");
  if (!product) {
    return sendErrorRes(res, "Product not find", 404);
  }

  res.json({
    product: {
      id: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      purchasingDate: product.purchasingDate,
      images: product.images?.map(({ url }) => url),
      thumbnail: product.thumbnail,
      seller: {
        id: product.owner._id,
        name: product.owner.name,
        avatar: product.owner?.avatar,
      },
    },
  });
};

export const getProductByCategory: RequestHandler = async (req, res) => {
  const { category } = req.params;
  const { pageNumber = "1", limit = "10" } = req.query as {
    pageNumber: string;
    limit: string;
  };
  if (!categories.includes(category)) {
    return sendErrorRes(res, "Invalid category", 422);
  }

  const products = await ProductModel.find({
    category: category,
  })
    .sort("-createdAt")
    .skip((+pageNumber - 1) * +limit)
    .limit(+limit);

  const listing = products.map((p) => {
    return {
      id: p._id,
      name: p.name,
      thumbnail: p.thumbnail,
      category: p.category,
      price: p.price,
    };
  });
  res.json({
    products: listing,
  });
};

export const getLatestProducts: RequestHandler = async (req, res) => {
  const products = await ProductModel.find().sort("-createdAt").limit(10);

  const listing = products.map((p) => {
    return {
      id: p._id,
      name: p.name,
      thumbnail: p.thumbnail,
      category: p.category,
      price: p.price,
    };
  });
  res.json({
    products: listing,
  });
};

export const getListings: RequestHandler = async (req, res) => {
  const { pageNumber = "1", limit = "10" } = req.query as {
    pageNumber: string;
    limit: string;
  };
  const products = await ProductModel.find({ owner: req.user.id })
    .sort("-createdAt")
    .skip((+pageNumber - 1) * +limit)
    .limit(+limit);

  const listings = products.map((p) => {
    return {
      id: p._id,
      name: p.name,
      thumbnail: p.thumbnail,
      category: p.category,
      price: p.price,
      image: p.images?.map((i) => i.url),
      date: p.purchasingDate,
      description: p.description,
      seller: {
        id: req.user.id,
        name: req.user.name,
        avatar: req.user.avatar,
      },
    };
  });

  res.json({ products: listings });
};
