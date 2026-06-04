"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditEmployee() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    salary: "",
  });

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const response = await fetch(
        `/api/emp-users/${params.id}`
      );

      const data = await response.json();

      if (data.success) {
        setFormData({
          name: data.employee.name,
          email: data.employee.email,
          designation: data.employee.designation,
          salary: data.employee.salary,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMessage("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/emp-users/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Employee Updated Successfully");
        router.push("/employees");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleUpdate}
        style={{
          width: "500px",
          background: "#fff",
          padding: "35px",
          borderRadius: "18px",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Update Employee
        </h2>

        {message && (
          <p
            style={{
              color: "red",
              marginBottom: "15px",
            }}
          >
            {message}
          </p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={formData.designation}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Update Employee
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  border: "1px solid #ddd",
  borderRadius: "8px",
};