import { Link } from "react-router-dom";
import logo from "../assets/logo.webp";
import heroImage from "../assets/hero.webp";
function HomePage() {

  return (
    <div
    style={{
        minHeight: "100vh",
        background:
        "linear-gradient(to bottom,#fff7fb,#ffffff)",
    }}
    >
      {/* Navbar */}
      <nav
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 50px",
            backgroundColor: "white",
            margin: "20px",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
        >
        <Link
            to="/"
            style={{
            textDecoration: "none",
            }}
        >
            <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
            }}
            >
            <img
                src={logo}
                alt="CampusSafeHer"
                style={{
                width: "50px",
                }}
            />

            <h2
                style={{
                margin: 0,
                color: "#d63384",
                }}
            >
                CampusSafeHer
            </h2>
            </div>
        </Link>

        <div
            style={{
            display: "flex",
            gap: "15px",
            }}
        >
            <Link to="/login">
            <button
                style={{
                padding: "12px 25px",
                borderRadius: "10px",
                border: "2px solid #8b5cf6",
                backgroundColor: "white",
                color: "#8b5cf6",
                cursor: "pointer",
                }}
            >
                Log In
            </button>
            </Link>

            <Link to="/register">
            <button
                style={{
                padding: "12px 25px",
                borderRadius: "10px",
                border: "none",
                background:
                    "linear-gradient(90deg,#8b5cf6,#ec4899)",
                color: "white",
                cursor: "pointer",
                }}
            >
                Get App
            </button>
            </Link>
        </div>
      </nav>

        {/* Hero Section */}
        <section
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "40px 60px",
                gap: "40px",
            }}
            >
            {/* Left Side */}
            <div style={{ flex: 1 }}>
                <h1
                style={{
                    fontSize: "3rem",
                    lineHeight: "1.2",
                    color: "#1f1147",
                    marginBottom: "20px",
                }}
                >
                Empowering
                <br />

                <span
                    style={{
                    color: "#ec4899",
                    }}
                >
                    Women's Safety
                </span>

                <br />
                Across University
                <br />
                Campuses
                </h1>

                <p
                style={{
                    fontSize: "18px",
                    color: "#555",
                    maxWidth: "600px",
                    marginBottom: "30px",
                }}
                >
                CampusSafeHer helps female students stay
                safe through emergency SOS alerts,
                trusted contacts, incident reporting,
                safety check-ins, and AI-powered support.
                </p>

                <div
                style={{
                    display: "flex",
                    gap: "15px",
                }}
                >
                <Link to="/register">
                    <button
                    style={{
                        padding: "14px 30px",
                        border: "none",
                        borderRadius: "12px",
                        background:
                        "linear-gradient(90deg,#8b5cf6,#ec4899)",
                        color: "white",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                    >
                    Get Started
                    </button>
                </Link>

                <a href="#about">
                    <button
                    style={{
                        padding: "14px 30px",
                        borderRadius: "12px",
                        border: "2px solid #8b5cf6",
                        backgroundColor: "white",
                        color: "#8b5cf6",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                    >
                    Learn More
                    </button>
                </a>
                </div>
            </div>

            {/* Right Side */}
            <div
                style={{
                flex: 1,
                textAlign: "center",
                }}
            >
                <img
                src={heroImage}
                alt="CampusSafeHer"
                style={{
                    width: "100%",
                    maxWidth: "700px",
                    animation:
                    "floatAnimation 3s ease-in-out infinite",
                }}
                />
            </div>
        </section>
    </div>
  );
}

export default HomePage;