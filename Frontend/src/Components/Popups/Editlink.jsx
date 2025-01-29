import React, { useEffect, useState } from "react";
import styles from "../Styles/Editlink.module.css";
import { X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function Editlink({ setEditlinkbtn, currLink, setrefresh }) {
  const [link, setlink] = useState("");
  const [remark, setremake] = useState("");
  const [ExpDate, setExpDate] = useState(null);
  const [Adddate, setAdddate] = useState(false);
  const [dateerr, setdataerr] = useState("");
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  function onSubmit(e) {
    e.preventDefault();
    if (Adddate && ExpDate.length === "0") {
      setdataerr("* Please Enter Date");
    } else {
      setdataerr("");
      updateLink();
    }

    async function updateLink() {
      try {
        const response = await fetch(`${BASE_URL}url/editinglink/${currLink}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            originalLink: link,
            remark: remark,
            expiryDate: ExpDate,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          toast.success("Link updated successfully");
          setEditlinkbtn(false);
          setrefresh((prev) => !prev);
        } else {
          toast.error("Faild to Update");
        }
      } catch (error) {
        toast.error("Failed to update the link");
      }
    }
  }

  useEffect(() => {
    Adddate ? setdataerr("* Select The Date") : setdataerr("");
  }, [Adddate]);

  useEffect(() => {
    fetchalink();
  }, []);

  async function fetchalink() {
    try {
      const response = await fetch(`${BASE_URL}url/editlinkdata/${currLink}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setlink(data?.originalLink);
        setremake(data?.remark);
        const formattedDate = data.expiryDate
          ? new Date(data.expiryDate).toISOString().split("T")[0]
          : null;
        setExpDate(formattedDate);
      } else {
        toast.error("Failed to fetch link data");
      }
    } catch (error) {
      console.error("Error deleting the link:", error);
    }
  }

  function toggleBackground() {
    setAdddate((prev) => (prev === false ? true : false));
  }
  return (
    <div className={styles.home}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          <p>Edit Link</p>
          <span className={styles.close} onClick={() => setEditlinkbtn(false)}>
            <X size={22} />
          </span>
        </h2>
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="destinationUrl" className={styles.label}>
              Destination Url *
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setlink(e.target.value)}
              className={styles.input}
              placeholder="https://web.whatsapp.com/"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="comments" className={styles.label}>
              Remarks *
            </label>
            <textarea
              value={remark}
              onChange={(e) => setremake(e.target.value)}
              className={styles.textarea}
              placeholder="Add remarks"
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="comments" className={styles.label}>
              <p>Link Expiration</p>
              <div className={styles.LDbtn}>
                <button
                  type="button"
                  style={{ marginLeft: Adddate == true ? "21px" : "3px" }}
                  onClick={toggleBackground}
                  className={styles.LBtoggel}
                ></button>
              </div>
            </label>
            <input
              type="date"
              className={styles.input}
              value={ExpDate}
              disabled={!Adddate}
              onChange={(e) => setExpDate(e.target.value)}
            ></input>
            <p className={styles.note}>{dateerr}</p>
          </div>
          <footer className={styles.actions}>
            <button type="button" className={styles.cancelBtn}>
              Clear
            </button>
            <button type="submit" className={styles.submitBtn}>
              Save
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default Editlink;
