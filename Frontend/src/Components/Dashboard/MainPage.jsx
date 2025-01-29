import React, { useState, useEffect } from "react";
import styles from "../Styles/MainPage.module.css";
import DashboardPage from "./DashboardPage";
import Links from "./Links";
import Analytics from "./Analytics";
import Setting from "./Setting";
import Addlink from "../Popups/Addlink";
import DeleteLink from "../Popups/DeleteLink";
import DeleteAcc from "../Popups/DeleteAcc";
import Editlink from "../Popups/Editlink";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import {
  Sun,
  Menu,
  Plus,
  Search,
  LayoutDashboard,
  Link,
  TrendingUp,
  Settings,
  SunMedium,
  Moon,
} from "lucide-react";

const MainPage = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [greeting, setgreeting] = useState(" ");
  const [dateinfo, setdateinfo] = useState("");
  const [CurrentUser, setCurrentUser] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [logoutbtn, setlogoutbtn] = useState(false);
  const [currLink, setcurrLink] = useState("");
  const [addlinkbtn, setaddlinkbtn] = useState(false);
  const [Editlinkbtn, setEditlinkbtn] = useState(false);
  const [dellinkbtn, setdellinkbtn] = useState(false);
  const [delaccpopup, setDelaccpopup] = useState(false);
  const [Serremark, setSetremark] = useState("");
  const [refresh, setrefresh] = useState(0);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    if (Serremark.length !== 0) {
      setActiveSection("Links");
    }
  }, [Serremark]);

  const checkMobileScreen = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  function logout() {
    localStorage.clear();
    toast.success("Logout Successfull");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }

  useEffect(() => {
    currentUser();
    getGreeting();
    checkMobileScreen();
    window.addEventListener("resize", checkMobileScreen);
    return () => window.removeEventListener("resize", checkMobileScreen);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const sections = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { icon: <Link size={18} />, label: "Links" },
    { icon: <TrendingUp size={18} />, label: "Analytics" },
  ];

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (isMobile) setIsMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return <DashboardPage />;
      case "Links":
        return (
          <Links
            setdellinkbtn={setdellinkbtn}
            setEditlinkbtn={setEditlinkbtn}
            Serremark={Serremark}
            setcurrLink={setcurrLink}
            refresh={refresh}
          />
        );
      case "Analytics":
        return <Analytics refresh={refresh} />;
      case "Settings":
        return <Setting setDelaccpopup={setDelaccpopup} />;
      default:
        return <div className={styles.mainContent}>Dashboard</div>;
    }
  };

  function getGreeting() {
    const now = new Date();
    const hours = now.getHours();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let greeting;
    if (hours < 12) {
      setgreeting(
        <>
          <SunMedium color="#00f028" size={21} /> Good Morning
        </>
      );
    } else if (hours < 18) {
      setgreeting(
        <>
          <Sun color="#00f028" size={21} /> Good Afternoon
        </>
      );
    } else {
      setgreeting(
        <>
          <Moon color="#312F84" size={21} /> Good Evening
        </>
      );
    }
    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();

    setdateinfo(`${day}, ${month} ${date}`);
  }

  async function currentUser() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}url/editUserdata`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data?.code === "2") {
        toast.error("You Are Not Authorized, Please Login", {
          duration: 900,
        });
        setTimeout(() => {
          navigate("/login");
        }, 1300);
      } else {
        setCurrentUser(data);
      }
    } catch (error) {
      console.error("Error deleting the link:", error);
    }
  }

  return (
    <div className={styles.mainContainer}>
      {isMobile && (
        <div
          className={`${styles.hamburgerMenu} ${
            isMenuOpen ? styles.menuOpen : ""
          }`}
          onClick={toggleMenu}
        >
          <span className={styles.hamburgerIcon}>
            <Menu color="#000000" />
          </span>
        </div>
      )}
      <div
        className={`${styles.leftSection} ${
          isMobile && isMenuOpen
            ? styles.menuOpen
            : isMobile
            ? styles.menuClosed
            : ""
        }`}
      >
        <div className={styles.logo}>
          <img src="./Images/Logo.png" alt="Logo" />
        </div>
        <ul className={styles.menu}>
          {sections.map((section, index) => (
            <li
              key={index}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
              className={
                activeSection === section.label ? styles.activeMenuItem : ""
              }
              onClick={() => handleSectionChange(section.label)}
            >
              {section.icon}
              {section.label}
            </li>
          ))}
          <div className={styles.settingItem}>
            <li
              className={
                activeSection === "Settings" ? styles.activeMenuItem : ""
              }
              onClick={() => handleSectionChange("Settings")}
            >
              <span>
                <Settings size={17} />
              </span>
              Settings
            </li>
          </div>
        </ul>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.navbar}>
          <span className={styles.greeting}>
            <p className={styles.name}>
              {greeting || "GoodMorning"}, {CurrentUser?.name || "User"}
            </p>
            <p className={styles.date}>{dateinfo || "Tue, Jan 25"}</p>
          </span>
          <div className={styles.navRight}>
            <button
              className={styles.create}
              onClick={() => setaddlinkbtn((prev) => !prev)}
            >
              {" "}
              <Plus size={22} />
              Create new
            </button>
            <div className={styles.search}>
              <span>
                <Search size={22} style={{ paddingTop: "0.2em" }} />
              </span>

              <input
                value={Serremark}
                onChange={(e) => setSetremark(e.target.value)}
                className={styles.inputfiled}
                placeholder="Search by remarks"
                type="text"
              />
            </div>
            <button
              className={styles.user}
              onClick={() => setlogoutbtn((prev) => !prev)}
            >
              {CurrentUser?.name?.slice(0, 2).toUpperCase() || "PP"}
            </button>
          </div>
          {logoutbtn && (
            <button className={styles.logout} onClick={logout}>
              Logout
            </button>
          )}
          {addlinkbtn && (
            <Addlink setaddlinkbtn={setaddlinkbtn} setrefresh={setrefresh} />
          )}
          {dellinkbtn && (
            <DeleteLink
              setdellinkbtn={setdellinkbtn}
              currLink={currLink}
              setrefresh={setrefresh}
            />
          )}
          {delaccpopup && <DeleteAcc setDelaccpopup={setDelaccpopup} />}
          {Editlinkbtn && (
            <Editlink
              setEditlinkbtn={setEditlinkbtn}
              currLink={currLink}
              setrefresh={setrefresh}
            />
          )}
        </div>
        {renderContent()}
      </div>
      <Toaster
        toastOptions={{
          style: {
            color: "white",
            backgroundColor: "rgb(157, 154, 154)",
            fontFamily: "Manrope",
            fontSize: "0.95em",
            fontWeight: "400",
            marginLeft: "1em",
          },
        }}
      />
    </div>
  );
};

export default MainPage;
