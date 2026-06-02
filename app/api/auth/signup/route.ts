import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import pool from "@/lib/db";

import { sendMail } from "@/lib/mailer";

export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const { name, email, password } = body;

    // validation
    if (!name || !email || !password) {

      return NextResponse.json(
        {
          success: false,
          message: "All fields required",
        },
        {
          status: 400,
        }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    await pool.query(
      `
        INSERT INTO std_users(name, email, password)
        VALUES($1, $2, $3)
      `,
      [name, email, hashedPassword]
    );

    // send email
    await sendMail(email, name);

    return NextResponse.json({
      success: true,
      message: "Signup successful",
    });

  } catch (error: any) {

  console.log(error);

  if (error.code === "23505") {
    return NextResponse.json(
      {
        success: false,
        message: "Email already exists",
      },
      {
        status: 409,
      }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: "Server Error",
    },
    {
      status: 500,
    }
  );
}
}