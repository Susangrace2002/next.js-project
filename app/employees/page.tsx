"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Employee {
  id: number;
  name: string;
  email: string;
  designation: string;
  salary: string;
}

export default function EmployeesPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/emp-users");
      const data = await response.json();

      if (data.success) {
        setEmployees(data.employees);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: number) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this employee?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(`/api/emp-users/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      setEmployees((prev) =>
        prev.filter((employee) => employee.id !== id)
      );
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
    alert("Failed to delete employee");
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        padding: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Employee List</h1>

        <button
          onClick={() => router.push("/dashboard")}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Designation</th>
                <th style={thStyle}>Salary</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td style={tdStyle}>{employee.id}</td>
                  <td style={tdStyle}>{employee.name}</td>
                  <td style={tdStyle}>{employee.email}</td>
                  <td style={tdStyle}>{employee.designation}</td>
                  <td style={tdStyle}>{employee.salary}</td>
                  <td style={tdStyle}>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={() =>
                          router.push(`/employees/edit/${employee.id}`)
                        }
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "20px",
                        }}
                        title="Edit Employee"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => deleteEmployee(employee.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "20px",
                        }}
                        title="Delete Employee"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "left" as const,
  background: "#f3f4f6",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "12px",
};