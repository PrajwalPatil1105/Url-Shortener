import React, { useEffect, useState } from "react";
import styles from "../Styles/Setting.module.css";
import toast, { Toaster } from "react-hot-toast";

function Setting({ setDelaccpopup }) {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [mobile, setmobile] = useState("");
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    fetchaUser();
  }, []);

  async function fetchaUser() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}url/editUserdata`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setname(data?.name);
        setemail(data?.email);
        setmobile(data?.mobile);
      } else {
        toast.error("Failed to fetch link data");
      }
    } catch (error) {
      console.error("Error deleting the link:", error);
    }
  }

  async function edituser() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}url/edituserdata`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          email: email,
          mobile: mobile,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        toast.success("User updated successfully");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update the link");
    }
  }

  return (
    <div className={styles.mainContent}>
      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <div className={styles.inputfields}>
            <div className={styles.inputfield}>
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
            </div>
            <div className={styles.inputfield}>
              <label>Email id </label>
              <input
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
            </div>
            <div className={styles.inputfield}>
              <label>Mobile no.</label>
              <input
                type="text"
                placeholder="Enter Mobile no"
                value={mobile}
                onChange={(e) => setmobile(e.target.value)}
              />
            </div>
            <div className={styles.buttons}>
              <button className={styles.btn1} onClick={edituser}>
                Save Changes
              </button>
              <button
                className={styles.btn2}
                onClick={() => setDelaccpopup(true)}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
