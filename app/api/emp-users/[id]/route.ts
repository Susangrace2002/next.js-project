import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const result = await pool.query(
      "DELETE FROM emp_users WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Employee deleted successfully",
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const result = await pool.query(
      "SELECT * FROM emp_users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        {
          status: 404,
        }
      );
    }

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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const {
      name,
      email,
      designation,
      salary,
    } = await req.json();

    const existingEmployee = await pool.query(
      "SELECT * FROM emp_users WHERE id = $1",
      [id]
    );

    if (existingEmployee.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        {
          status: 404,
        }
      );
    }

    const emailExists = await pool.query(
      "SELECT * FROM emp_users WHERE email = $1 AND id != $2",
      [email, id]
    );

    if (emailExists.rows.length > 0) {
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
      `UPDATE emp_users
       SET name = $1,
           email = $2,
           designation = $3,
           salary = $4
       WHERE id = $5
       RETURNING *`,
      [name, email, designation, salary, id]
    );

    return NextResponse.json({
      success: true,
      employee: result.rows[0],
      message: "Employee updated successfully",
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