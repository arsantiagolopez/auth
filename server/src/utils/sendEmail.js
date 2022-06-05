import sgMail from "@sendgrid/mail";
import Config from "../config";

const SENDGRID_FROM_EMAIL = Config.sendgrid.fromEmail;

// Set the API key
sgMail.setApiKey(Config.sendgrid.apiKey);

const sendEmail = async (to, subject, html) => {
  // Configure email
  const msg = {
    to,
    from: SENDGRID_FROM_EMAIL,
    subject,
    html,
  };

  // Send email
  await sgMail.send(msg);
};

export { sendEmail };
