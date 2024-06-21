import { RequestHandler } from "express";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import imagekit from "src/cloud";
import fs from "fs";
import ProductModel from "src/models/product";
import { sendErrorRes } from "src/utils/helper";

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
