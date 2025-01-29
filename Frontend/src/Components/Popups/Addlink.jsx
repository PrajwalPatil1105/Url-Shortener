import React, { useEffect, useState } from "react";
import styles from "../Styles/Addlink.module.css";
import { Link, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function Addlink({ setaddlinkbtn, setrefresh }) {
  const [link, setlink] = useState("");
  const [remark, setremake] = useState("");
  const [ExpDate, setExpDate] = useState(null);
  const [Adddate, setAdddate] = useState(false);
  const [linkerr, setlinkerr] = useState("");
  const [remarkerr, setremarkerr] = useState("");
  const [dateerr, setdataerr] = useState("");
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  function clear() {
    setlink("");
    setremake("");
    setExpDate("");
  }

  async function onSubmit(e) {
    e.preventDefault();
    let isValid = true;
    if (link.length === 0) {
      setlinkerr("* Please Enter Link");
      isValid = false;
    } else {
      setlinkerr("");
    }
    if (remark.length === 0) {
      setremarkerr("* Please Enter Remark");
      isValid = false;
    } else {
      setremarkerr("");
    }
    if (Adddate && (!ExpDate || ExpDate.length === 0)) {
      setdataerr("* Please Enter Date");
      isValid = false;
    } else {
      setdataerr("");
    }
    if (!isValid) {
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}url/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          originalLink: link,
          remark: remark,
          expiryDate: ExpDate,
        }),
      });
      const data = await response.json();
      if (data?.code === "1") {
        toast.success(data?.message);
        clear();
        setrefresh((prev) => !prev);
        setTimeout(() => {
          setaddlinkbtn(false);
        }, 1000);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    Adddate ? setdataerr("* Select The Date") : setdataerr("");
  }, [Adddate]);

  function toggleBackground() {
    setAdddate((prev) => (prev === false ? true : false));
  }
  return (
    <div className={styles.home}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          <p>New Link</p>
          <span className={styles.close} onClick={() => setaddlinkbtn(false)}>
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
              placeholder="Ex:- https://web.whatsapp.com/"
            />
            <p className={styles.note}>{linkerr}</p>
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
            <p className={styles.note}>{remarkerr}</p>
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
            <button type="button" className={styles.cancelBtn} onClick={clear}>
              Clear
            </button>
            <button type="submit" className={styles.submitBtn}>
              Create new
            </button>
          </footer>
        </form>
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
    </div>
  );
}

export default Addlink;
