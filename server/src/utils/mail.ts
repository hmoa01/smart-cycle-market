import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT) || undefined,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

const sendVerification = async (email: string, link: string) => {
  await transport.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    html: `<h1>Please click on <a href="${link}"> this link</a> to verify your account.</h1>`,
  });
};

const sendPasswordResetLink = async (email: string, link: string) => {
  await transport.sendMail({
    from: process.env.NODEMAILER_EMAIL_SECURITY,
    to: email,
    html: `<h1>Please click on <a href="${link}"> this link</a> to update your password.</h1>`,
  });
};

const mail = {
  sendVerification,
  sendPasswordResetLink,
};

export default mail;
