import nodemailer from "nodemailer";

const sendVerification = async (email: string, link: string) => {
  const transport = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: Number(process.env.NODEMAILER_PORT) || undefined,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transport.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    html: `<h1>Please click on <a href="${link}"> this link</a> to verify your account.</h1>`,
  });
};
const mail = {
  sendVerification,
};

export default mail;
