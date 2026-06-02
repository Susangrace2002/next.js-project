import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
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

    jwt.verify(token, process.env.JWT_SECRET as string);

    const { name, email, designation, salary } =
      await req.json();

    const existingUser = await pool.query(
      "SELECT * FROM emp_users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        {
          status: 400,
        }
      );
    }

    const result = await pool.query(
      `INSERT INTO emp_users
      (name, email, designation, salary)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [name, email, designation, salary]
    );

    return NextResponse.json({
      success: true,
      employee: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM emp_users ORDER BY id DESC"
    );

    return NextResponse.json(
      {
        success: true,
        employees: result.rows,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("GET EMPLOYEES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch employees",
      },
      {
        status: 500,
      }
    );
  }
}