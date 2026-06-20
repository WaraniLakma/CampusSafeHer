import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.webp";
import registerImage from "../assets/register.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      alert("Login Successful!");

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div
        style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#fff7fb",
        }}
    >
        {/* LEFT SIDE */}
        <div
        style={{
            flex: 1,
            backgroundColor: "white",
            padding: "70px 90px",
        }}
        >
        {/* LOGO */}
        <div
            style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
            }}
        >
            <img
            src={logo}
            alt="Logo"
            style={{
                width: "40px",
                height: "40px",
                objectFit: "contain",
            }}
            />

            <h2
            style={{
                color: "#1f1147",
                margin: 0,
            }}
            >
            CampusSafe
            <span
                style={{
                color: "#ec4899",
                }}
            >
                Her
            </span>
            </h2>
        </div>

        <h1
            style={{
            color: "#1f1147",
            fontSize: "3rem",
            marginBottom: "10px",
            }}
        >
            Welcome Back
        </h1>

        <p
            style={{
            color: "#666",
            fontSize: "18px",
            marginBottom: "50px",
            }}
        >
            Login to continue protecting yourself
            with CampusSafeHer.
        </p>

        <form onSubmit={handleLogin}>
            {/* EMAIL */}
            <div
            style={{
                marginBottom: "30px",
                textAlign: "left",
            }}
            >
            <label>Email Address</label>

            <input
                type="email"
                value={email}
                onChange={(e) =>
                setEmail(e.target.value)
                }
                placeholder="Enter your email"
                style={{
                width: "100%",
                padding: "15px",
                marginTop: "8px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                }}
            />
            </div>

            {/* PASSWORD */}
            <div
            style={{
                marginBottom: "20px",
                textAlign: "left",
            }}
            >
            <label>Password</label>

            <input
                type="password"
                value={password}
                onChange={(e) =>
                setPassword(e.target.value)
                }
                placeholder="Enter your password"
                style={{
                width: "100%",
                padding: "15px",
                marginTop: "8px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                }}
            />
            </div>

            <div
            style={{
                textAlign: "right",
                marginBottom: "30px",
            }}
            >
            <span
                style={{
                color: "#ec4899",
                cursor: "pointer",
                fontSize: "14px",
                }}
            >
                Forgot Password?
            </span>
            </div>

            {/* LOGIN BUTTON */}
            <button
            type="submit"
            style={{
                width: "100%",
                padding: "18px",
                border: "none",
                borderRadius: "12px",
                background:
                "linear-gradient(90deg,#8b5cf6,#ec4899)",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
            }}
            >
            Login
            </button>

            <p
            style={{
                marginTop: "25px",
                textAlign: "center",
            }}
            >
            Don't have an account?{" "}
            <span
                onClick={() =>
                navigate("/register")
                }
                style={{
                color: "#ec4899",
                cursor: "pointer",
                fontWeight: "bold",
                }}
            >
                Register
            </span>
            </p>
        </form>
        </div>

        {/* RIGHT SIDE */}
        <div
        style={{
            flex: 1,
            backgroundImage: `linear-gradient(
            rgba(91,33,182,0.55),
            rgba(236,72,153,0.55)
            ),
            url(${registerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }}
        />
    </div>
  );
}

export default Login;