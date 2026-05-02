import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, number, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_TO || process.env.SMTP_USER,
      replyTo: email,
      subject: `[Portfolio Contact] ${subject}`,
      text: `
Name: ${name}
Phone: ${number || "N/A"}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e4e8; border-radius: 8px;">
          <h2 style="color: #0366d6; margin-top: 0;">New message from your portfolio</h2>
          <hr style="border: 0; border-top: 1px solid #e1e4e8; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${number || "N/A"}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f6f8fa; border-radius: 6px;">
            <p style="margin-top: 0; font-weight: bold;">Message:</p>
            <p style="white-space: pre-wrap; margin-bottom: 0;">${message}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("SMTP Error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
