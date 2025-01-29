import React from "react";
import styles from "../Styles/DeleteAcc.module.css";
import { X } from "lucide-react";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";

function DeleteAcc({ setDelaccpopup }) {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
  async function delUser() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}url/delUser`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(data?.message);
        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 1000);
      } else {
        toast.error("User not deleted");
      }
    } catch (error) {
      console.error("Error deleting the link:", error);
    }
  }

  return (
    <div className={styles.home}>
      <div className={styles.modal}>
        <div className={styles.close} onClick={() => setDelaccpopup(false)}>
          <X size={22} />
        </div>
        <p>Are you sure, you want to delete the account?</p>
        <div className={styles.btns}>
          <button className={styles.btn1} onClick={() => setDelaccpopup(false)}>
            No
          </button>
          <button className={styles.btn2} onClick={delUser}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAcc;
