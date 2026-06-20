import { useState,useEffect, } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.webp";


function Dashboard() {
  const navigate = useNavigate();
  const [showSOSPopup, setShowSOSPopup] =
  useState(false);
  const [activeSOSId, setActiveSOSId] = useState(null);
  const [showSidebar, setShowSidebar] =
  useState(false);
  const [showProfile, setShowProfile] =
  useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
    
    }, []);

  const handleSOS = () => {
    navigator.geolocation.getCurrentPosition(
        async (position) => {
        try {
            console.log(position.coords);

            const token =
            localStorage.getItem("token");

            if (
            position.coords.accuracy > 1000
            ) {
            alert(
                "Location accuracy is too low. Please move to an open area and try again."
            );
            return;
            }

            const res = await API.post(
            "/sos",
            {
                latitude:
                position.coords.latitude,

                longitude:
                position.coords.longitude,
            },
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );
            setActiveSOSId(res.data.sos._id);
            alert(
            "🚨 SOS Alert Sent Successfully!\n\nYour current location has been shared with your trusted contacts."
            );

            setShowSOSPopup(false);
        } catch (error) {
            console.log(error);
        }
        },
        (error) => {
        console.log(error);

        alert(
            "Unable to get your location."
        );
        },
        {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        }
    );
    

  };
  const handleSafeConfirm = async () => {
    try {
        const token = localStorage.getItem("token");

        await API.patch(
        `/sos/${activeSOSId}/resolve`,
        {},
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        alert(
        "✅ Safety confirmed. Trusted contacts can now see that you are safe."
        );

        setActiveSOSId(null);
    } catch (error) {
        console.log(error);
    }
  };
  const fetchUser = async () => {
    try {
        const token =
        localStorage.getItem("token");

        const res = await API.get(
        "/auth/profile",
        {
            headers: {
            Authorization:
                `Bearer ${token}`,
            },
        }
        );

        setUser(res.data.user);
    } catch (error) {
        console.log(error);
    }
  };
  return (
    <div
        style={{
        display: "flex",
        minHeight: "100vh",
        background:
            "linear-gradient(135deg,#fff1f8,#fff7fd)",
        }}
    >
        {/* SIDEBAR */}
        <div
        style={{
        width: showSidebar ? "240px" : "0",
        backgroundColor: "white",
        borderRight: showSidebar
            ? "1px solid #f3d4e7"
            : "none",
        padding: showSidebar ? "25px" : "0",
        overflow: "hidden",
        transition: "0.3s ease",
        boxShadow: showSidebar
            ? "2px 0 15px rgba(0,0,0,0.06)"
            : "none",
        }}
        >
            <div
                style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "40px",
                cursor: "pointer",
                }}
                onClick={() => navigate("/")}
            >
            <img
            src={logo}
            alt="logo"
            style={{
                width: "40px",
            }}
            />

            <h2
            style={{
                color: "#1f1147",
                margin: 0,
            }}
            >
            CampusSafeHer
            </h2>
        </div>

        <div
            style={{
            display: "flex",
            flexDirection: "column",
            gap: "25px",
            }}
        >
            <span
            style={{
                padding: "14px 10px",
                borderBottom: "1px solid #f3d4e7",
                cursor: "pointer",
                color: "#1f1147",
                fontWeight: "500",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                "#fdf2f8";
                e.currentTarget.style.color = "#ec4899";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                "transparent";
                e.currentTarget.style.color = "#1f1147";
            }}
            onClick={() => navigate("/contacts")}
            >
            🏠 Dashboard
            </span>

            <span
            style={{
                padding: "14px 10px",
                borderBottom: "1px solid #f3d4e7",
                cursor: "pointer",
                color: "#1f1147",
                fontWeight: "500",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                "#fdf2f8";
                e.currentTarget.style.color = "#ec4899";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                "transparent";
                e.currentTarget.style.color = "#1f1147";
            }}
            onClick={() => navigate("/contacts")}
            >
            👥 Contacts
            </span>

            <span
            style={{
                padding: "14px 10px",
                borderBottom: "1px solid #f3d4e7",
                cursor: "pointer",
                color: "#1f1147",
                fontWeight: "500",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                "#fdf2f8";
                e.currentTarget.style.color = "#ec4899";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                "transparent";
                e.currentTarget.style.color = "#1f1147";
            }}
            onClick={() => navigate("/contacts")}
            >
            📝 Incidents
            </span>

            <span
            style={{
                padding: "14px 10px",
                borderBottom: "1px solid #f3d4e7",
                cursor: "pointer",
                color: "#1f1147",
                fontWeight: "500",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                "#fdf2f8";
                e.currentTarget.style.color = "#ec4899";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                "transparent";
                e.currentTarget.style.color = "#1f1147";
            }}
            onClick={() => navigate("/contacts")}
            >
            📍 Check-Ins
            </span>

            <span
            style={{
                padding: "14px 10px",
                borderBottom: "1px solid #f3d4e7",
                cursor: "pointer",
                color: "#1f1147",
                fontWeight: "500",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                "#fdf2f8";
                e.currentTarget.style.color = "#ec4899";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                "transparent";
                e.currentTarget.style.color = "#1f1147";
            }}
            onClick={() => navigate("/contacts")}
            >
            🔔 Alerts
            </span>

            <span
            style={{
                padding: "14px 10px",
                borderBottom: "1px solid #f3d4e7",
                cursor: "pointer",
                color: "#1f1147",
                fontWeight: "500",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                "#fdf2f8";
                e.currentTarget.style.color = "#ec4899";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                "transparent";
                e.currentTarget.style.color = "#1f1147";
            }}
            onClick={() => navigate("/contacts")}
            >
            🤖 AI Assistant
            </span>
        </div>
        </div>

        {/* MAIN CONTENT */}
        <div
        style={{
            flex: 1,
            padding: "30px",
        }}
        >
        {/* TOP BAR */}
        <div
            style={{
            backgroundColor: "white",
            borderRadius: "25px",
            padding: "20px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow:
                "0 5px 15px rgba(0,0,0,0.05)",
            }}
        >
            <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
            }}
            >
            <span
            onClick={() =>
                setShowSidebar(!showSidebar)
            }
            style={{
                fontSize: "26px",
                cursor: "pointer",
                color: "#1f1147",
            }}
            >
            ☰
            </span>
            </div>

            <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
            }}
            >
            <div
                onClick={() =>
                    setShowProfile(!showProfile)
                }
                style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    background:
                    "linear-gradient(135deg,#8b5cf6,#ec4899)",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    cursor: "pointer",
                }}
                >
                {user?.name
            ?.split(" ")[0]
            ?.charAt(0)
            ?.toUpperCase()}
            </div>

            {showProfile && (
                <div
                    style={{
                    position: "absolute",
                    top: "90px",
                    right: "30px",
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "15px",
                    boxShadow:
                        "0 8px 20px rgba(0,0,0,0.1)",
                    minWidth: "220px",
                    textAlign: "center",
                    zIndex: 1000,
                    }}
                >
                    <div
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background:
                        "linear-gradient(135deg,#8b5cf6,#ec4899)",
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 auto 10px",
                        fontWeight: "bold",
                        fontSize: "24px",
                    }}
                    >
                    {user?.name
                    ?.split(" ")[0]
                    ?.charAt(0)
                    ?.toUpperCase()}
                    </div>

                    <h3
                    style={{
                        marginBottom: "5px",
                        color: "#1f1147",
                    }}
                    >
                    {
                    user?.name
                        ?.split(" ")
                        .map(
                        word =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1)
                        )
                        .join(" ")
                    }
                    </h3>

                    <p
                    style={{
                        fontSize: "14px",
                        color: "#666",
                    }}
                    >
                    {user?.email}
                    </p>

                    
                </div>
            )}
            <div>
            <strong>
                Hi, {
                    user?.name
                        ?.split(" ")[0]
                        ?.charAt(0)
                        .toUpperCase() +
                    user?.name
                        ?.split(" ")[0]
                        ?.slice(1)
                    }
            </strong>
            </div>

            <button
                onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                }}
                style={{
                    padding: "10px 22px",
                    borderRadius: "12px",
                    border: "none",
                    background:
                    "linear-gradient(90deg,#8b5cf6,#ec4899)",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow:
                    "0 4px 12px rgba(236,72,153,0.25)",
                }}
                >
                Logout
            </button>
            </div>
        </div>

        {/* WELCOME */}
        <div
        style={{
            marginTop: "40px",
        }}
        >
        <h1
            style={{
            color: "#1f1147",
            }}
        >
            Welcome Back 👋
        </h1>

        <p>
            Your personal safety center.
            Stay connected, protected
            and informed.
        </p>
        </div>

        {/* QUICK ACTIONS */}
        <div
        style={{
            marginTop: "40px",
        }}
        >
        <h2
            style={{
            color: "#1f1147",
            marginBottom: "25px",
            }}
        >
            Quick Actions
        </h2>

        <div
            style={{
            display: "flex",
            gap: "40px",
            flexWrap: "wrap",
            alignItems: "center",
            }}
        >
            {/* SOS CIRCLE */}
            <div
            onClick={() => setShowSOSPopup(true)}
            style={{
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                background:
                "linear-gradient(135deg,#ec4899,#8b5cf6)",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                boxShadow:
                "0 10px 25px rgba(236,72,153,0.3)",
            }}
            >
            <div
                style={{
                fontSize: "55px",
                }}
            >
                🚨
            </div>

            <h3>SOS</h3>

            <p
                style={{
                textAlign: "center",
                padding: "0 50px",
                }}
            >
                Send Emergency Alert
            </p>
            </div>

            {/* STATS CARDS */}
            <div
            style={{
                display: "grid",
                gridTemplateColumns:
                "repeat(2,180px)",
                gap: "20px",
            }}
            >
            <div
            style={{
                background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                color: "white",
                padding: "20px",
                borderRadius: "20px",
                textAlign: "center",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
            >
            <span>📍 CheckIns</span>
            <span
                style={{
                fontSize: "24px",
                }}
            >
                →
            </span>
            </div>

            <div
            style={{
                background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                color: "white",
                padding: "20px",
                borderRadius: "20px",
                textAlign: "center",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
            >
            <span>🚨 Alerts</span>
            <span
                style={{
                fontSize: "24px",
                }}
            >
                →
            </span>
            </div>

            <div
            style={{
                background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                color: "white",
                padding: "20px",
                borderRadius: "20px",
                textAlign: "center",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
            >
            <span>📝 Reports</span>
            <span
                style={{
                fontSize: "24px",
                }}
            >
                →
            </span>
            </div>

            <div
            style={{
                background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                color: "white",
                padding: "20px",
                borderRadius: "20px",
                textAlign: "center",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
            >
            <span>👥Contacts</span>
            <span
                style={{
                fontSize: "24px",
                }}
            >
                →
            </span>
            </div>
            </div>
        </div>

        {/* QUICK ACCESS */}
        <h2
            style={{
            marginTop: "50px",
            color: "#1f1147",
            }}
        >
            Quick Access
        </h2>

        <div
            style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "20px",
            maxWidth: "600px",
            }}
        >
            <button
            onClick={() => navigate("/contacts")}
            style={{
                padding: "18px",
                border: "none",
                borderRadius: "18px",
                background:
                "linear-gradient(90deg,#ec4899,#f97316)",
                color: "white",
                fontSize: "18px",
                cursor: "pointer",
            }}
            >
            👥 Manage Contacts
            </button>

            <button
            onClick={() => navigate("/incidents")}
            style={{
                padding: "18px",
                border: "none",
                borderRadius: "18px",
                background:
                "linear-gradient(90deg,#ec4899,#f97316)",
                color: "white",
                fontSize: "18px",
                cursor: "pointer",
            }}
            >
            📝 Report Incident
            </button>

            <button
            onClick={() => navigate("/ai")}
            style={{
                padding: "18px",
                border: "none",
                borderRadius: "18px",
                background:
                "linear-gradient(90deg,#ec4899,#f97316)",
                color: "white",
                fontSize: "18px",
                cursor: "pointer",
            }}
            >
            🤖 Ask AI Assistant
            </button>
        </div>
        </div>
        </div>
    </div>
    
   );
}

export default Dashboard;