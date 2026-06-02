import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and Password are required",
        },
        {
          status: 400,
        }
      );
    }

    // Check user exists
    const user = await pool.query(
      "SELECT * FROM std_users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Credentials",
        },
        {
          status: 401,
        }
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Credentials",
        },
        {
          status: 401,
        }
      );
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user.rows[0].id,
        email: user.rows[0].email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    // Create Response
    const response = NextResponse.json(
      {
        success: true,
        message: "Login Successful",
        user: {
          id: user.rows[0].id,
          name: user.rows[0].name,
          email: user.rows[0].email,
        },
      },
      {
        status: 200,
      }
    );

    // Store JWT in HttpOnly Cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return response;
  } catch (error) {
    console.log("Login Error:", error);

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