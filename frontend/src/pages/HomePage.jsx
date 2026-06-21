import { Link } from "react-router-dom";
import logo from "../assets/logo.webp";
import heroImage from "../assets/herosection.png";
import sosImage from "../assets/sos.jpg";
import checkInImage from "../assets/checkins.png";
import contactsImage from "../assets/contacts.jpg";
import incidentImage from "../assets/incident.jpg";
import aiImage from "../assets/aisafety.webp";
import aboutImage from "../assets/about.jpg";

const FEATURES = [
  {
    image: sosImage,
    icon: "🚨",
    title: "Emergency SOS",
    desc: "Send instant SOS alerts to your trusted contacts during emergencies.",
  },
  {
    image: checkInImage,
    icon: "📍",
    title: "Safety Check-In",
    desc: "Keep your trusted contacts informed about your journey and arrival.",
  },
  {
    image: contactsImage,
    icon: "👨‍👩‍👧",
    title: "Trusted Contacts",
    desc: "Manage trusted contacts who receive emergency notifications when needed.",
  },
  {
    image: incidentImage,
    icon: "📝",
    title: "Incident Reports",
    desc: "Report incidents anonymously or openly to help improve campus safety.",
  },
  {
    image: aiImage,
    icon: "🤖",
    title: "AI Assistant",
    desc: "Get safety guidance, emergency tips, and support anytime through our AI assistant.",
  },
];

function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#fff1f8,#fff7fd)",
        fontFamily: "var(--sans)",
        color: "#1f1147",
        textAlign: "left",
      }}
    >
      <style>{`
        @keyframes floatAnimation {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .home-btn {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .home-btn:hover {
          filter: brightness(1.05);
          transform: translateY(-2px);
        }
        .home-btn:active {
          transform: translateY(0);
        }
        .feature-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(31, 17, 71, 0.1) !important;
        }
        .nav-link {
          transition: color 0.2s ease;
          text-decoration: none;
          color: #6b6375;
          font-weight: 500;
          font-size: 15px;
        }
        .nav-link:hover {
          color: #ec4899;
        }
      `}</style>

      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 50px",
          backgroundColor: "white",
          margin: "20px 30px 0",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(31, 17, 71, 0.06)",
          border: "1px solid #f3d4e7",
          position: "sticky",
          top: "20px",
          zIndex: 100,
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src={logo} alt="CampusSafeHer" style={{ width: "44px", height: "44px" }} />
            <h2 style={{ margin: 0, color: "#1f1147", fontWeight: "700", fontSize: "20px" }}>
              CampusSafe<span style={{ color: "#ec4899" }}>Her</span>
            </h2>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">About</a>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link to="/login">
              <button
                className="home-btn"
                style={{
                  padding: "11px 24px",
                  borderRadius: "12px",
                  border: "2px solid #8b5cf6",
                  backgroundColor: "white",
                  color: "#8b5cf6",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                Log In
              </button>
            </Link>
            <Link to="/register">
              <button
                className="home-btn"
                style={{
                  padding: "11px 24px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "14px",
                  boxShadow: "0 4px 15px rgba(236,72,153,0.25)",
                }}
              >
                Get App
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px 80px",
          gap: "50px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 400px", maxWidth: "600px" }}>
          <span
            style={{
              display: "inline-block",
              backgroundColor: "#fdf2f8",
              color: "#ec4899",
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            🛡️ Safety First, Always
          </span>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
              lineHeight: "1.15",
              color: "#1f1147",
              marginBottom: "24px",
              fontWeight: "700",
              letterSpacing: "-0.5px",
            }}
          >
            Empowering{" "}
            <span style={{ color: "#ec4899" }}>Women's Safety</span>
            <br />
            Across University Campuses
          </h1>

          <p
            style={{
              fontSize: "17px",
              color: "#6b6375",
              lineHeight: "1.7",
              marginBottom: "32px",
            }}
          >
            CampusSafeHer helps female students stay safe through emergency SOS alerts,
            trusted contacts, incident reporting, safety check-ins, and AI-powered support.
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <Link to="/register">
              <button
                className="home-btn"
                style={{
                  padding: "15px 32px",
                  border: "none",
                  borderRadius: "12px",
                  background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "600",
                  boxShadow: "0 4px 15px rgba(236,72,153,0.25)",
                }}
              >
                Get Started
              </button>
            </Link>
            <a href="#about">
              <button
                className="home-btn"
                style={{
                  padding: "15px 32px",
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  backgroundColor: "white",
                  color: "#475569",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Learn More
              </button>
            </a>
          </div>
        </div>

        <div style={{ flex: "1 1 400px", textAlign: "center" }}>
          <img
            src={heroImage}
            alt="CampusSafeHer"
            style={{
              width: "100%",
              maxWidth: "580px",
              animation: "floatAnimation 3s ease-in-out infinite",
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "80px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <span
            style={{
              color: "#ec4899",
              fontWeight: "600",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Our Features
          </span>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              color: "#1f1147",
              marginTop: "10px",
              fontWeight: "700",
            }}
          >
            Designed for Your Safety
          </h2>
          <p style={{ color: "#6b6375", fontSize: "16px", marginTop: "12px", maxWidth: "500px", margin: "12px auto 0" }}>
            Everything you need to stay connected, protected, and informed on campus.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "24px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="feature-card"
              style={{
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(31, 17, 71, 0.06)",
                border: "1px solid #f3d4e7",
              }}
            >
              <img
                src={feature.image}
                alt={feature.title}
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
              />
              <div style={{ padding: "22px 24px" }}>
                <h3 style={{ margin: "0 0 10px", color: "#1f1147", fontSize: "17px", fontWeight: "700" }}>
                  {feature.icon} {feature.title}
                </h3>
                <p style={{ margin: 0, color: "#6b6375", fontSize: "14px", lineHeight: "1.6" }}>
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        style={{
          padding: "80px 60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "60px",
          flexWrap: "wrap",
          backgroundColor: "white",
          margin: "0 30px",
          borderRadius: "24px",
          border: "1px solid #f3d4e7",
          boxShadow: "0 4px 25px rgba(31, 17, 71, 0.04)",
        }}
      >
        <div style={{ flex: "1 1 400px" }}>
          <span
            style={{
              color: "#ec4899",
              fontWeight: "600",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            About CampusSafeHer
          </span>

          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "#1f1147",
              lineHeight: "1.25",
              marginTop: "12px",
              fontWeight: "700",
            }}
          >
            Building a Safer Tomorrow
            <br />
            <span style={{ color: "#ec4899" }}>for Every Woman</span>
          </h2>

          <p style={{ color: "#6b6375", lineHeight: "1.8", marginTop: "20px", fontSize: "15px" }}>
            CampusSafeHer was designed to provide a safe and supportive environment for
            female university students by combining emergency response tools, trusted
            contact networks, incident reporting, and intelligent safety assistance into
            one platform.
          </p>

          <p style={{ color: "#6b6375", lineHeight: "1.8", marginTop: "14px", fontSize: "15px" }}>
            Our mission is to empower women through technology that not only responds to
            emergencies but also helps prevent them.
          </p>

          <a href="#features">
            <button
              className="home-btn"
              style={{
                marginTop: "28px",
                padding: "14px 30px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
                color: "white",
                fontWeight: "600",
                fontSize: "15px",
                boxShadow: "0 4px 15px rgba(236,72,153,0.25)",
              }}
            >
              Explore Features
            </button>
          </a>
        </div>

        <div style={{ flex: "1 1 350px", textAlign: "center" }}>
          <img
            src={aboutImage}
            alt="About CampusSafeHer"
            style={{
              width: "100%",
              maxWidth: "480px",
              borderRadius: "24px",
              boxShadow: "0 12px 30px rgba(31, 17, 71, 0.1)",
            }}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "60px 30px" }}>
        <div
          style={{
            padding: "45px 50px",
            borderRadius: "24px",
            background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
            color: "white",
            boxShadow: "0 12px 40px rgba(139, 92, 246, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "30px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
              <img
                src={logo}
                alt="CampusSafeHer Logo"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "18px",
                  backgroundColor: "white",
                  padding: "8px",
                }}
              />
              <div>
                <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", marginBottom: "10px", fontWeight: "700", color: "white" }}>
                  Ready to Take Control
                  <br />
                  of Your Safety?
                </h2>
                <p style={{ fontSize: "16px", opacity: 0.92, maxWidth: "480px", margin: 0 }}>
                  Join thousands of students who trust CampusSafeHer to stay connected,
                  protected, and informed.
                </p>
              </div>
            </div>

            <Link to="/register">
              <button
                className="home-btn"
                style={{
                  padding: "16px 36px",
                  borderRadius: "14px",
                  border: "none",
                  backgroundColor: "white",
                  color: "#ec4899",
                  fontSize: "16px",
                  fontWeight: "700",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                Get Started Now →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#1f1147",
          color: "white",
          padding: "50px 60px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "40px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <img
                src={logo}
                alt="CampusSafeHer"
                style={{
                  width: "44px",
                  borderRadius: "10px",
                  backgroundColor: "white",
                  padding: "4px",
                }}
              />
              <h3 style={{ margin: 0, fontWeight: "700" }}>
                CampusSafe<span style={{ color: "#ec4899" }}>Her</span>
              </h3>
            </div>
            <p style={{ maxWidth: "300px", color: "#9ca3af", fontSize: "14px", lineHeight: "1.7" }}>
              Empowering female students with technology-driven safety solutions,
              emergency support, and trusted connections.
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: "16px", fontSize: "16px" }}>Quick Links</h3>
            {[
              { to: "/", label: "Home" },
              { to: "/login", label: "Login" },
              { to: "/register", label: "Register" },
            ].map((link) => (
              <p key={link.label} style={{ margin: "8px 0" }}>
                <Link
                  to={link.to}
                  style={{ color: "#9ca3af", textDecoration: "none", fontSize: "14px" }}
                >
                  {link.label}
                </Link>
              </p>
            ))}
          </div>

          <div>
            <h3 style={{ marginBottom: "16px", fontSize: "16px" }}>Contact</h3>
            <p style={{ color: "#9ca3af", fontSize: "14px", margin: "8px 0" }}>
              support@campussafeher.com
            </p>
            <p style={{ color: "#9ca3af", fontSize: "14px", margin: "8px 0" }}>
              University of Ruhuna
            </p>
            <p style={{ color: "#9ca3af", fontSize: "14px", margin: "8px 0" }}>
              DesignHer 2.0 Project
            </p>
          </div>
        </div>

        <hr style={{ margin: "30px 0 20px", borderColor: "#374151", border: "none", borderTop: "1px solid #374151" }} />

        <p style={{ textAlign: "center", color: "#6b7280", fontSize: "13px", margin: 0 }}>
          © 2026 CampusSafeHer. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
