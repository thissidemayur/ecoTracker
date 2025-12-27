import { createTransport } from "nodemailer";
import { config } from "./index.js";

const sendMail = async ({ email, subject, html }) => {
  const transport = createTransport({
    host: config.SMTP.HOST,
    port: config.SMTP.PORT,
    auth: {
      user: config.SMTP.USER,
      pass: config.SMTP.PASSWORD,
    },
  });

  await transport.sendMail({
    from: config.SMTP.USER,
    subject,
    html,
    to: email,
  });
};
export { sendMail };
