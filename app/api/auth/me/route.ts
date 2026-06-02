import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      id: number;
      email: string;
    };

    const user = await pool.query(
      "SELECT id, name, email FROM std_users WHERE id = $1",
      [decoded.id]
    );

    if (user.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: user.rows[0],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("ME API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Invalid Token",
      },
      {
        status: 401,
      }
    );
  }
}