import nodemailer from "nodemailer";

const getTransporter = () =>
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(String(process.env.EMAIL_PORT)),
    secure: false,
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD,
    },
  });

export async function sendSineUpTokenEmail(token: string, email: string) {
  await getTransporter().sendMail({
    from: `"ECOM ADMIN" <${process.env.EMAIL_SENDER}>`,
    to: email,
    subject: "Email Verification Link",
    text: `
Click on the following link to signup
${process.env.HOST + "/verifyemail?token=" + token}
    `,
  });
}
