import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email provider (e.g., SMTP)
  auth: {
    user: process.env.EMAIL_USER, // Set this in environment variables
    pass: process.env.EMAIL_PASS, // Set this in environment variables
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
