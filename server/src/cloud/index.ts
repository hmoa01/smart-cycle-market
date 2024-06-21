import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.CLOUD_PUBLIC_KEY!,
  privateKey: process.env.CLOUD_PRIVATE_KEY!,
  urlEndpoint: process.env.CLOUD_URL!,
});

export default imagekit;
