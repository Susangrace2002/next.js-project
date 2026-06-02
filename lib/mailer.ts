import nodemailer from "nodemailer";

export const sendMail = async (
  email: string,
  name: string
) => {

  try {

    const transporter = nodemailer.createTransport({

      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: email,

      subject: "Registration Successful",

      html: `
        <h2>Hello ${name},</h2>

        <p>Your account has been created successfully.</p>

        <p>Welcome to our platform.</p>
      `,
    });

    console.log("Email sent successfully");

  } catch (error) {

    console.log("Email Error:", error);
  }
};