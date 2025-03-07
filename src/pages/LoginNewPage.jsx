import React, { useState } from "react";

function LoginNewPage() {
  const [userType, setUserType] = useState(""); // State to track selected user type

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  return (
    <div className="LoginNewPage">
      <header className="Login-header">
        <h2>Login</h2>
      </header>
      <div
        style={{
          maxWidth: "400px",
          margin: "40px auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
        }}
      >
        <h2>{userType === "agent" ? "Agent Login" : userType === "plant" ? "Plant Login" : "Select User Type"}</h2>
        <br />
        <form>
          <div className="radio-container" style={{ marginBottom: "20px" }}>
            <label>
              <input
                type="radio"
                name="userType"
                value="plant"
                onChange={handleUserTypeChange}
                required
              />{" "}
              Plant Page
            </label>
            <label>
              <input
                type="radio"
                name="userType"
                value="agent"
                onChange={handleUserTypeChange}
                required
              />{" "}
              Agency Page
            </label>
          </div>

          {userType === "agent" && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <label
                  htmlFor="agencyId"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Agent ID:
                </label>
                <input
                  type="text"
                  id="agencyId"
                  name="agencyId"
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  htmlFor="password"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </>
          )}

          {userType === "plant" && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <label
                  htmlFor="plantId"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Plant ID:
                </label>
                <input
                  type="text"
                  id="plantId"
                  name="plantId"
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  htmlFor="plantPassword"
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  Password:
                </label>
                <input
                  type="password"
                  id="plantPassword"
                  name="plantPassword"
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              background: "#007bff",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginNewPage;
