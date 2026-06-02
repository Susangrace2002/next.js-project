"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<{
  id: number;
  name: string;
  email: string;
} | null>(null);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchUser();
}, []);

  const handleLogout = async () => {
  await fetch("/api/auth/logout", {
    method: "POST",
  });

  router.push("/login");
};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#fff",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#2563eb",
          }}
        >
          My Dashboard
        </h2>

        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main
  style={{
    padding: "40px",
  }}
>
  <div
    style={{
      background: "#fff",
      padding: "24px",
      borderRadius: "16px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      marginBottom: "24px",
    }}
  >
    <h1
      style={{
        marginBottom: "10px",
        fontSize: "28px",
        fontWeight: "bold",
        color: "#272d7b",
      }}
    >
      Welcome {user?.name || "User"} 👋
    </h1>

    <p
      style={{
        color: "#666",
        marginBottom: "20px",
      }}
    >
      {user?.email}
    </p>

    <button
      onClick={() => router.push("/create-employee")}
      style={{
        background: "#2563eb",
        color: "#fff",
        border: "none",
        padding: "12px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      Create Employee
    </button>
    <button
  onClick={() => router.push("/employees")}
  style={{
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    marginLeft: "10px",
  }}
>
  Employee List
</button>
  </div>

  {/* Cards */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
      }}
    >
      <h3>Total Users</h3>
      <h1>120</h1>
    </div>

    <div
      style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
      }}
    >
      <h3>Total Posts</h3>
      <h1>45</h1>
    </div>

    <div
      style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
      }}
    >
      <h3>Active Sessions</h3>
      <h1>18</h1>
    </div>
  </div>
</main>
    </div>
  );
}