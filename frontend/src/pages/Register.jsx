import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import registerImage from "../assets/register.png";
import logo from "../assets/logo.webp";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [university, setUniversity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
  useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
        }

      await API.post("/auth/register", {
        name: `${firstName} ${lastName}`,
        email,
        password,
      });

      alert(
        "Registration Successful!"
      );

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration Failed"
      );
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
        Create Account
      </h1>

      <p
        style={{
          color: "#666",
          fontSize: "18px",
          marginBottom: "50px",
        }}
      >
        Join CampusSafeHer and stay safe,
        connected and empowered.
      </p>

      <form onSubmit={handleRegister}>
        {/* FIRST + LAST NAME */}
        <div
          style={{
            display: "flex",
            gap: "40px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              flex: 1,
              textAlign: "left",
            }}
          >
            <label>First Name</label>

            <input
              type="text"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              placeholder="Enter first name"
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
              flex: 1,
              textAlign: "left",
            }}
          >
            <label>Last Name</label>

            <input
              type="text"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
              placeholder="Enter last name"
              style={{
                width: "100%",
                padding: "15px",
                marginTop: "8px",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />
          </div>
        </div>

        {/* UNIVERSITY */}
        <div
          style={{
            marginBottom: "30px",
            textAlign: "left",
          }}
        >
          <label>
            University / Institution
          </label>

          <select
            value={university}
            onChange={(e) =>
              setUniversity(e.target.value)
            }
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "8px",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">
              Select your university
            </option>

            <option>
              University of Ruhuna
            </option>

            <option>
              University of Moratuwa
            </option>

            <option>
              University of Colombo
            </option>

            <option>
              University of Peradeniya
            </option>

            <option>
              University of Kelaniya
            </option>

            <option>Other</option>
          </select>
        </div>
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
                placeholder="Enter your email address"
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
                display: "flex",
                gap: "40px",
                marginBottom: "30px",
            }}
            >
            <div
                style={{
                flex: 1,
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
                placeholder="Enter password"
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
                flex: 1,
                textAlign: "left",
                }}
            >
                <label>Confirm Password</label>

                <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                    setConfirmPassword(e.target.value)
                }
                placeholder="Confirm password"
                style={{
                    width: "100%",
                    padding: "15px",
                    marginTop: "8px",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                }}
                />
            </div>
        </div>
        <div
            style={{
                border: "1px solid #f3c4da",
                backgroundColor: "#fff7fb",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "30px",
                textAlign: "left",
            }}
            >
            <h4>Password must:</h4>

            <p>
                {password.length >= 8 ? "✅" : "❌"} At least
                8 characters
            </p>

            <p>
                {/[A-Z]/.test(password) ? "✅" : "❌"} One
                uppercase letter (A-Z)
            </p>

            <p>
                {/[a-z]/.test(password) ? "✅" : "❌"} One
                lowercase letter (a-z)
            </p>

            <p>
                {/[0-9]/.test(password) ? "✅" : "❌"} One
                number (0-9)
            </p>
        </div>
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
            Create Account
        </button>
        <p
            style={{
                marginTop: "25px",
                textAlign: "center",
            }}
            >
            Already have an account?{" "}
            <span
                onClick={() => navigate("/login")}
                style={{
                color: "#ec4899",
                cursor: "pointer",
                fontWeight: "bold",
                }}
            >
                Login
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

export default Register;