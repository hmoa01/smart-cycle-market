import nodemailer from "nodemailer";
import { MailtrapClient } from "mailtrap";

const TOKEN = process.env.NODEMAILER_TOKEN!;

const client = new MailtrapClient({ token: TOKEN });

const transport = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT) || undefined,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

const sendTestVerificationMail = async (email: string, link: string) => {
  await transport.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    html: `<h1>Please click on <a href="${link}"> this link</a> to verify your account.</h1>`,
  });
};

const sendVerificationMailProd = async (email: string, link: string) => {
  const sender = {
    email: "support@ahmedlemes.com",
    name: "Smart Cycle Market",
  };

  const recipients = [
    {
      email,
    },
  ];

  client
    .send({
      from: sender,
      to: recipients,
      template_uuid: "d1e740c4-db04-4669-95df-943a6ec7de67",
      template_variables: {
        confirmation_link: link,
        user_name: email,
      },
    })
    .then(console.log, console.error);
};

const sendVerification = async (email: string, link: string) => {
  if (process.env.NODE_ENV === "development")
    sendTestVerificationMail(email, link);
  else sendVerificationMailProd(email, link);
};

const sendPasswordResetLink = async (email: string, link: string) => {
  await transport.sendMail({
    from: process.env.NODEMAILER_EMAIL_SECURITY,
    to: email,
    html: `<h1>Please click on <a href="${link}"> this link</a> to update your password.</h1>`,
  });
};

const sendPasswordUpdateMessage = async (email: string) => {
  await transport.sendMail({
    from: process.env.NODEMAILER_EMAIL_SECURITY,
    to: email,
    html: `<h1>Your password is updated, you can now use your new password.</h1>`,
  });
};

const mail = {
  sendVerification,
  sendPasswordResetLink,
  sendPasswordUpdateMessage,
};

export default mail;
