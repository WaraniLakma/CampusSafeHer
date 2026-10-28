import { useState } from "react";
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
    badge: "Instant Dispatch",
    title: "Emergency SOS",
    desc: "Broadcast one-touch SOS alerts with real-time GPS coordinates to your personal circle and campus responders.",
  },
  {
    image: checkInImage,
    icon: "📍",
    badge: "Smart Tracking",
    title: "Safety Check-In",
    desc: "Set journey destinations and estimated arrival times. Automated reminders protect you along every step.",
  },
  {
    image: contactsImage,
    icon: "👥",
    badge: "Trusted Circle",
    title: "Trusted Contacts",
    desc: "Manage family, roommates, and security officers who receive instant push warnings if you are overdue.",
  },
  {
    image: incidentImage,
    icon: "📝",
    badge: "Confidential",
    title: "Incident Reports",
    desc: "Submit anonymous or attributed safety reports with photos and statements to improve campus vigilance.",
  },
  {
    image: aiImage,
    icon: "🤖",
    badge: "24/7 Assistance",
    title: "AI Safety Companion",
    desc: "Get instant guidance, draft official complaint letters, and receive emergency protocol advice at any time.",
  },
];

const TRUST_METRICS = [
  { value: "< 5s", label: "Alert Dispatch Speed", icon: "⚡" },
  { value: "100%", label: "Encrypted & Confidential", icon: "🔒" },
  { value: "24/7", label: "Real-Time AI Support", icon: "🤖" },
  { value: "GPS", label: "Live Pinpoint Accuracy", icon: "📍" },
];

function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--grad-hero-bg)",
        fontFamily: "var(--font-main)",
        color: "var(--dark-800)",
        textAlign: "left",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        .nav-item-link {
          text-decoration: none;
          color: #475569;
          font-weight: 600;
          font-size: 15px;
          transition: color 0.2s ease;
          position: relative;
          padding: 6px 0;
        }
        .nav-item-link:hover {
          color: #ec4899;
        }
        .nav-item-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: #ec4899;
          transition: width 0.2s ease;
          border-radius: 2px;
        }
        .nav-item-link:hover::after {
          width: 100%;
        }
        .feature-card-hover {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .feature-card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(31, 17, 71, 0.1) !important;
          border-color: #f472b6 !important;
        }
        .feature-card-hover:hover .feature-img {
          transform: scale(1.04);
        }
        .feature-img {
          transition: transform 0.4s ease;
        }
        .trust-stat-card {
          transition: transform 0.2s ease;
        }
        .trust-stat-card:hover {
          transform: translateY(-3px);
        }
      `}</style>

      {/* AMBIENT BACKGROUND GLOW EFFECTS */}
      <div
        style={{
          position: "absolute",
          top: "-150px",
          left: "5%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, rgba(255,255,255,0) 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "120px",
          right: "0%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(255,255,255,0) 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* FLOATING GLASS NAVBAR */}
      <header
        style={{
          position: "sticky",
          top: "16px",
          zIndex: 1000,
          padding: "0 24px",
          maxWidth: "1280px",
          margin: "16px auto 0",
        }}
      >
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 28px",
            backgroundColor: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            borderRadius: "22px",
            boxShadow: "0 10px 30px rgba(31, 17, 71, 0.06)",
            border: "1px solid rgba(243, 212, 231, 0.8)",
          }}
        >
          {/* LOGO */}
          <Link to="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  backgroundColor: "#fdf2f8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(236, 72, 153, 0.15)",
                }}
              >
                <img
                  src={logo}
                  alt="CampusSafeHer Logo"
                  style={{ width: "34px", height: "34px", objectFit: "contain" }}
                />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "21px",
                  fontWeight: "800",
                  color: "#1f1147",
                  letterSpacing: "-0.5px",
                }}
              >
                CampusSafe<span style={{ color: "#ec4899" }}>Her</span>
              </div>
            </div>
          </Link>

          {/* DESKTOP LINKS & ACTIONS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "36px",
            }}
            className="desktop-nav-content"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
              <a href="#features" className="nav-item-link">Features</a>
              <a href="#about" className="nav-item-link">About Mission</a>
              <a href="#trust" className="nav-item-link">Safety Network</a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link to="/account-type" state={{ action: "login" }} style={{ textDecoration: "none" }}>
                <button
                  className="btn-secondary"
                  style={{
                    padding: "10px 22px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "1.5px solid #ddd6fe",
                    color: "#7c3aed",
                    backgroundColor: "white",
                  }}
                >
                  Sign In
                </button>
              </Link>

              <Link to="/account-type" state={{ action: "register" }} style={{ textDecoration: "none" }}>
                <button
                  className="btn-primary"
                  style={{
                    padding: "10px 24px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Get Started →
                </button>
              </Link>
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              border: "1px solid #cbd5e1",
              backgroundColor: "#f8fafc",
              borderRadius: "10px",
              padding: "8px 12px",
              fontSize: "18px",
              cursor: "pointer",
            }}
            className="mobile-toggle-btn"
          >
            ☰
          </button>
        </nav>

        {/* MOBILE MENU DROPDOWN */}
        {mobileMenuOpen && (
          <div
            style={{
              marginTop: "10px",
              backgroundColor: "white",
              borderRadius: "18px",
              padding: "20px",
              boxShadow: "0 14px 35px rgba(31, 17, 71, 0.12)",
              border: "1px solid #f3d4e7",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: "#1f1147", textDecoration: "none", fontWeight: "600" }}
            >
              Features
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: "#1f1147", textDecoration: "none", fontWeight: "600" }}
            >
              About Mission
            </a>
            <div style={{ display: "flex", gap: "10px", paddingTop: "8px", borderTop: "1px solid #fce7f3" }}>
              <Link to="/account-type" state={{ action: "login" }} style={{ flex: 1, textDecoration: "none" }}>
                <button className="btn-secondary" style={{ width: "100%", padding: "10px" }}>
                  Sign In
                </button>
              </Link>
              <Link to="/account-type" state={{ action: "register" }} style={{ flex: 1, textDecoration: "none" }}>
                <button className="btn-primary" style={{ width: "100%", padding: "10px" }}>
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "70px 30px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "50px",
          flexWrap: "wrap",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* LEFT COLUMN: HERO CONTENT */}
        <div style={{ flex: "1 1 500px", maxWidth: "640px" }}>
          {/* LIVE STATUS PILL */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "#ffffff",
              border: "1px solid #fbcfe8",
              padding: "8px 18px",
              borderRadius: "30px",
              boxShadow: "0 4px 14px rgba(236, 72, 153, 0.12)",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                display: "inline-block",
                boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.25)",
              }}
            />
            <span
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "#be185d",
                letterSpacing: "0.2px",
              }}
            >
              24/7 University Student Protection Active
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 5.2vw, 3.6rem)",
              lineHeight: "1.12",
              color: "#1f1147",
              margin: "0 0 24px",
              fontWeight: "800",
              letterSpacing: "-1px",
            }}
          >
            Empowering{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Women's Safety
            </span>
            <br />
            Across Every Campus
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#64748b",
              lineHeight: "1.75",
              margin: "0 0 36px",
              maxWidth: "560px",
            }}
          >
            A dedicated security platform designed for female students. Experience rapid
            one-touch SOS alerts, automated journey check-ins, encrypted incident reporting, and 24/7 intelligent AI guidance.
          </p>

          {/* CTA ACTION BUTTONS */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "40px" }}>
            <Link to="/account-type" state={{ action: "register" }} style={{ textDecoration: "none" }}>
              <button
                className="btn-primary"
                style={{
                  padding: "16px 36px",
                  fontSize: "16px",
                  borderRadius: "14px",
                  boxShadow: "0 8px 24px rgba(236, 72, 153, 0.3)",
                }}
              >
                <span>Get Started Now</span>
                <span style={{ fontSize: "18px" }}>→</span>
              </button>
            </Link>

            <a href="#features" style={{ textDecoration: "none" }}>
              <button
                className="btn-secondary"
                style={{
                  padding: "16px 32px",
                  fontSize: "16px",
                  borderRadius: "14px",
                  backgroundColor: "white",
                  border: "1.5px solid #cbd5e1",
                  color: "#334155",
                }}
              >
                Explore Features ↓
              </button>
            </a>
          </div>

          {/* TRUST PILL BULLETS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
              paddingTop: "20px",
              borderTop: "1px solid #fce7f3",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#475569", fontWeight: "600" }}>
              <span style={{ color: "#10b981" }}>✓</span> Real-Time GPS Tracking
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#475569", fontWeight: "600" }}>
              <span style={{ color: "#10b981" }}>✓</span> Instant Circles Notification
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#475569", fontWeight: "600" }}>
              <span style={{ color: "#10b981" }}>✓</span> 100% Free for Students
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HERO FLOATING GRAPHIC */}
        <div
          style={{
            flex: "1 1 450px",
            maxWidth: "580px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Subtle glow underneath the image */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              height: "80%",
              background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(139,92,246,0.1) 60%, transparent 80%)",
              filter: "blur(30px)",
              zIndex: 0,
            }}
          />

          <img
            src={heroImage}
            alt="CampusSafeHer App Interface"
            style={{
              width: "100%",
              maxHeight: "540px",
              objectFit: "contain",
              animation: "floatAnimation 4s ease-in-out infinite",
              position: "relative",
              zIndex: 1,
              filter: "drop-shadow(0 20px 30px rgba(31, 17, 71, 0.12))",
            }}
          />
        </div>
      </section>

      {/* TRUST METRICS ROW */}
      <section
        id="trust"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "20px 30px 60px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "24px",
            boxShadow: "0 10px 30px rgba(31, 17, 71, 0.04)",
            border: "1px solid #f3d4e7",
          }}
        >
          {TRUST_METRICS.map((metric) => (
            <div
              key={metric.label}
              className="trust-stat-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "10px",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #fdf2f8 0%, #f5f3ff 100%)",
                  border: "1px solid #fbcfe8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                {metric.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "26px",
                    fontWeight: "800",
                    color: "#1f1147",
                    lineHeight: "1.2",
                  }}
                >
                  {metric.value}
                </div>
                <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>
                  {metric.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section
        id="features"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "60px 30px 90px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <span
            style={{
              backgroundColor: "#fdf2f8",
              color: "#be185d",
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px",
              display: "inline-block",
              marginBottom: "12px",
              border: "1px solid #fbcfe8",
            }}
          >
            Intelligent Safety Suite
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              color: "#1f1147",
              margin: "0 0 16px",
              fontWeight: "800",
            }}
          >
            Engineered For Immediate Peace of Mind
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: "17px",
              maxWidth: "580px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Explore the complete toolset built specifically to protect, alert, and support students day and night across campus.
          </p>
        </div>

        {/* FEATURE CARDS GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "28px",
          }}
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="feature-card-hover"
              style={{
                backgroundColor: "white",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 8px 25px rgba(31, 17, 71, 0.04)",
                border: "1px solid #f3d4e7",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* IMAGE HOLDER WITH HOVER ZOOM */}
              <div
                style={{
                  height: "200px",
                  overflow: "hidden",
                  position: "relative",
                  backgroundColor: "#f8fafc",
                }}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="feature-img"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.92)",
                    backdropFilter: "blur(8px)",
                    color: "#be185d",
                    padding: "5px 12px",
                    borderRadius: "14px",
                    fontSize: "12px",
                    fontWeight: "700",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                  }}
                >
                  {feature.badge}
                </span>
              </div>

              {/* CARD DETAILS */}
              <div style={{ padding: "26px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "24px" }}>{feature.icon}</span>
                  <h3
                    style={{
                      margin: 0,
                      color: "#1f1147",
                      fontSize: "19px",
                      fontWeight: "700",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {feature.title}
                  </h3>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                    fontSize: "15px",
                    lineHeight: "1.65",
                    flexGrow: 1,
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT MISSION SECTION */}
      <section
        id="about"
        style={{
          maxWidth: "1280px",
          margin: "0 auto 80px",
          padding: "0 30px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "32px",
            padding: "60px",
            border: "1px solid #f3d4e7",
            boxShadow: "0 10px 40px rgba(31, 17, 71, 0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "60px",
            flexWrap: "wrap",
          }}
        >
          {/* LEFT: TEXT */}
          <div style={{ flex: "1 1 450px" }}>
            <span
              style={{
                backgroundColor: "#f5f3ff",
                color: "#7c3aed",
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1px",
                display: "inline-block",
                marginBottom: "16px",
                border: "1px solid #ddd6fe",
              }}
            >
              Our Core Mission
            </span>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 3.8vw, 2.7rem)",
                color: "#1f1147",
                lineHeight: "1.2",
                margin: "0 0 20px",
                fontWeight: "800",
              }}
            >
              Fostering a Culture of{" "}
              <span style={{ color: "#ec4899" }}>Confidence & Rapid Care</span>
            </h2>

            <p style={{ color: "#64748b", lineHeight: "1.8", fontSize: "16px", margin: "0 0 16px" }}>
              CampusSafeHer was conceived to address the everyday safety challenges faced by female students in university dorms, late-night libraries, and commute routes.
            </p>

            <p style={{ color: "#64748b", lineHeight: "1.8", fontSize: "16px", margin: "0 0 28px" }}>
              By seamlessly connecting peers, safety networks, and automated timers, we reduce emergency response delays from minutes to seconds, providing reliable protection with complete confidentiality.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link to="/account-type" state={{ action: "register" }} style={{ textDecoration: "none" }}>
                <button
                  className="btn-primary"
                  style={{
                    padding: "14px 30px",
                    borderRadius: "14px",
                    fontSize: "15px",
                  }}
                >
                  Join CampusSafeHer Today
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT: IMAGE WITH OVERLAY BADGE */}
          <div style={{ flex: "1 1 380px", textAlign: "center", position: "relative" }}>
            <img
              src={aboutImage}
              alt="University Campus Students"
              style={{
                width: "100%",
                maxWidth: "480px",
                borderRadius: "24px",
                boxShadow: "0 16px 35px rgba(31, 17, 71, 0.12)",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </section>

      {/* CALL TO ACTION (CTA) SECTION */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto 80px",
          padding: "0 30px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
            borderRadius: "32px",
            padding: "55px 60px",
            color: "white",
            boxShadow: "0 20px 50px rgba(139, 92, 246, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "35px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* DECORATIVE LIGHT CIRCLES */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "24px", maxWidth: "680px" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "20px",
                backgroundColor: "white",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                flexShrink: 0,
              }}
            >
              <img
                src={logo}
                alt="CampusSafeHer"
                style={{ width: "50px", height: "50px", objectFit: "contain" }}
              />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)",
                  margin: "0 0 10px",
                  fontWeight: "800",
                  color: "white",
                  lineHeight: "1.2",
                }}
              >
                Ready to Take Control of Your Campus Safety?
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "rgba(255, 255, 255, 0.92)",
                  margin: 0,
                  lineHeight: "1.6",
                }}
              >
                Set up your profile in under 2 minutes. Add trusted friends, activate check-in timers, and travel with peace of mind.
              </p>
            </div>
          </div>

          <Link to="/account-type" state={{ action: "register" }} style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "16px 36px",
                borderRadius: "16px",
                border: "none",
                backgroundColor: "#ffffff",
                color: "#be185d",
                fontSize: "16px",
                fontWeight: "800",
                cursor: "pointer",
                boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 14px 30px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.18)";
              }}
            >
              <span>Get Started Now</span>
              <span>→</span>
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          backgroundColor: "#160e33",
          color: "white",
          padding: "60px 40px 30px",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          {/* BRAND COL */}
          <div style={{ maxWidth: "360px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                }}
              >
                <img src={logo} alt="CampusSafeHer" style={{ width: "30px", height: "30px", objectFit: "contain" }} />
              </div>
              <h3 style={{ margin: 0, fontWeight: "800", fontSize: "20px", fontFamily: "var(--font-display)" }}>
                CampusSafe<span style={{ color: "#ec4899" }}>Her</span>
              </h3>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
              An intelligent safety initiative empowering university students through automated alerts,
              encrypted incident reports, and community care.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 style={{ margin: "0 0 16px", fontSize: "15px", color: "white", fontWeight: "700" }}>
              Navigation
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>
                Home
              </Link>
              <Link to="/account-type" state={{ action: "login" }} style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>
                Student Login
              </Link>
              <Link to="/account-type" state={{ action: "register" }} style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>
                Student Register
              </Link>
              <Link to="/admin-login" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>
                Administrator Portal
              </Link>
            </div>
          </div>

          {/* PROJECT & CONTACT INFO */}
          <div>
            <h4 style={{ margin: "0 0 16px", fontSize: "15px", color: "white", fontWeight: "700" }}>
              Project & Contact
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 8px" }}>
              ✉️ support@campussafeher.com
            </p>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 8px" }}>
              🏫 University of Ruhuna
            </p>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
              🏆 DesignHer 2.0 Innovation Project
            </p>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            color: "#64748b",
            fontSize: "13px",
          }}
        >
          <div>© 2026 CampusSafeHer. All Rights Reserved.</div>
          <div style={{ display: "flex", gap: "20px" }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Guarantee</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
