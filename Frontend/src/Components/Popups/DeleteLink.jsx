import React from "react";
import styles from "../Styles/DeleteLink.module.css";
import { X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function DeleteLink({ setdellinkbtn, currLink, setrefresh }) {
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
  async function del() {
    try {
      const response = await fetch(`${BASE_URL}url/dellinks/${currLink}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data?.message);
        setdellinkbtn(false);
        setrefresh((prev) => !prev);
      } else {
        toast.error("Link not deleted");
      }
    } catch (error) {
      console.error("Error deleting the link:", error);
    }
  }

  return (
    <div className={styles.home}>
      <div className={styles.modal}>
        <div className={styles.close} onClick={() => setdellinkbtn(false)}>
          <X size={22} />
        </div>
        <p>Are you sure, you want to remove it?</p>
        <div className={styles.btns}>
          <button className={styles.btn1} onClick={() => setdellinkbtn(false)}>
            No
          </button>
          <button className={styles.btn2} onClick={del}>
            Yes
          </button>
        </div>
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
}

export default DeleteLink;
