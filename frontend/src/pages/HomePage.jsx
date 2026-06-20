import { Link } from "react-router-dom";
import logo from "../assets/logo.webp";
import heroImage from "../assets/hero.webp";
import sosImage from "../assets/sos.jpg";
import checkInImage from "../assets/checkins.png";
import contactsImage from "../assets/contacts.jpg";
import incidentImage from "../assets/incident.jpg";
import aiImage from "../assets/aisafety.webp";
import aboutImage from "../assets/about.jpg";
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
        <section
            style={{
                padding: "80px 50px",
                textAlign: "center",
            }}
            >
            <p
                style={{
                color: "#ec4899",
                fontWeight: "bold",
                fontSize: "18px",
                }}
            >
                Our Features
            </p>

            <h2
                style={{
                fontSize: "2.5rem",
                color: "#1f1147",
                marginBottom: "50px",
                }}
            >
                Designed for Your Safety
            </h2>

            <div
                style={{
                display: "flex",
                justifyContent: "center",
                gap: "25px",
                flexWrap: "wrap",
                }}
            >
                {/* SOS */}
                <div
                style={{
                    width: "250px",
                    background: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow:
                    "0 5px 20px rgba(0,0,0,0.08)",
                }}
                >
                <img
                    src={sosImage}
                    alt="SOS"
                    style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    }}
                />

                <div style={{ padding: "20px" }}>
                    <h3>🚨 Emergency SOS</h3>

                    <p>
                    Send instant SOS alerts to your
                    trusted contacts during
                    emergencies.
                    </p>
                </div>
                </div>

                {/* Check-In */}
                <div
                style={{
                    width: "250px",
                    background: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow:
                    "0 5px 20px rgba(0,0,0,0.08)",
                }}
                >
                <img
                    src={checkInImage}
                    alt="Check-In"
                    style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    }}
                />

                <div style={{ padding: "20px" }}>
                    <h3>📍 Safety Check-In</h3>

                    <p>
                    Keep your trusted contacts
                    informed about your journey and
                    arrival.
                    </p>
                </div>
                </div>

                {/* Trusted Contacts */}
                <div
                style={{
                    width: "250px",
                    background: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow:
                    "0 5px 20px rgba(0,0,0,0.08)",
                }}
                >
                <img
                    src={contactsImage}
                    alt="Trusted Contacts"
                    style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    }}
                />

                <div style={{ padding: "20px" }}>
                    <h3>👨‍👩‍👧 Trusted Contacts</h3>

                    <p>
                    Manage trusted contacts who
                    receive emergency notifications
                    when needed.
                    </p>
                </div>
                </div>

                {/* Incident Reports */}
                <div
                style={{
                    width: "250px",
                    background: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow:
                    "0 5px 20px rgba(0,0,0,0.08)",
                }}
                >
                <img
                    src={incidentImage}
                    alt="Incident Reports"
                    style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    }}
                />

                <div style={{ padding: "20px" }}>
                    <h3>📝 Incident Reports</h3>

                    <p>
                    Report incidents anonymously or
                    openly to help improve campus
                    safety.
                    </p>
                </div>
                </div>

                {/* AI Assistant */}
                <div
                style={{
                    width: "250px",
                    background: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow:
                    "0 5px 20px rgba(0,0,0,0.08)",
                }}
                >
                <img
                    src={aiImage}
                    alt="AI Assistant"
                    style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    }}
                />

                <div style={{ padding: "20px" }}>
                    <h3>🤖 AI Assistant</h3>

                    <p>
                    Get safety guidance, emergency
                    tips, and support anytime through
                    our AI assistant.
                    </p>
                </div>
                </div>
            </div>
        </section>
        <section
            id="about"
            style={{
                padding: "100px 60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "60px",
                background:
                "linear-gradient(to right,#fff7fb,#ffffff)",
            }}
            >
            {/* Left Side */}
            <div
                style={{
                flex: 1,
                }}
            >
                <p
                style={{
                    color: "#ec4899",
                    fontWeight: "bold",
                }}
                >
                About CampusSafeHer
                </p>

                <h2
                style={{
                    fontSize: "3rem",
                    color: "#1f1147",
                    lineHeight: "1.3",
                }}
                >
                Building a Safer Tomorrow
                <br />

                <span
                    style={{
                    color: "#ec4899",
                    }}
                >
                    for Every Woman
                </span>
                </h2>

                <p
                style={{
                    color: "#555",
                    lineHeight: "1.8",
                    marginTop: "20px",
                }}
                >
                CampusSafeHer was designed to provide
                a safe and supportive environment for
                female university students by combining
                emergency response tools, trusted
                contact networks, incident reporting,
                and intelligent safety assistance into
                one platform.
                </p>

                <p
                style={{
                    color: "#555",
                    lineHeight: "1.8",
                }}
                >
                Our mission is to empower women through
                technology that not only responds to
                emergencies but also helps prevent
                them.
                </p>

                <button
                style={{
                    marginTop: "20px",
                    padding: "14px 30px",
                    borderRadius: "12px",
                    border: "none",
                    background:
                    "linear-gradient(90deg,#8b5cf6,#ec4899)",
                    color: "white",
                    cursor: "pointer",
                }}
                >
                Learn More About Us
                </button>
            </div>

            {/* Right Side */}
            <div
                style={{
                flex: 1,
                textAlign: "center",
                }}
            >
                <img
                src={aboutImage}
                alt="About CampusSafeHer"
                style={{
                    width: "100%",
                    maxWidth: "500px",
                    borderRadius: "30px",
                }}
                />
            </div>
        </section>
                
    </div>
  );
}

export default HomePage;