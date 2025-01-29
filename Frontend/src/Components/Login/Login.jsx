import React, { useState } from "react";
import styles from "../Styles/Login.module.css";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [emailErr, setemailErr] = useState("");
  const [passwordErr, setpasswordErr] = useState("");
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    if (email.length === 0) {
      setemailErr("*Please Enter Email");
    } else if (!email.includes("@")) {
      setemailErr("*Enter Valid Email");
    } else {
      setemailErr("");
    }

    password.length === 0
      ? setpasswordErr("*Please Enter Password")
      : setpasswordErr("");

    if (email.length >= 3 && password.length >= 1) {
      try {
        const response = await fetch(`${BASE_URL}auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data?.code === "1") {
          localStorage.setItem("token", data.token);
          toast.success(data?.message);
          setTimeout(() => {
            navigate("/main");
          }, 2000);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Login failed. Please try again.");
      }
    }
  }

  function SignUp() {
    navigate("/");
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.Rightsection}>
          <img className={styles.Rightheading} src="./Images/Logo.png" alt="" />
          <img className={styles.Img1} src="./Images/MainImg.png" alt="" />
        </div>
        <div className={styles.Leftsection}>
          <div className={styles.navBtn}>
            <button className={styles.navBtn1} onClick={SignUp}>
              SignUp
            </button>
            <button className={styles.navBtn2}>Login</button>
          </div>
          <div className={styles.Leftmain}>
            <p className={styles.L1}>Log In</p>

            <form onSubmit={handleSubmit}>
              <div className={styles.InputFields}>
                <input
                  className={styles.Emailinput}
                  type="text"
                  name="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="Email id"
                />
                <span className={styles.errMsg}>{emailErr}</span>
              </div>
              <div className={styles.InputFields}>
                <input
                  className={styles.Passwordinput}
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  placeholder="Password"
                />
                <span className={styles.errMsg}>{passwordErr}</span>
              </div>
              <button className={styles.SigninBtn}>Log In</button>
              <p className={styles.L2}>
                Already have an account?{" "}
                <span className={styles.Signup} onClick={SignUp}>
                  SignUp
                </span>
              </p>
            </form>
          </div>
        </div>
        <Toaster
          toastOptions={{
            style: {
              color: "white",
              backgroundColor: "rgb(172, 167, 167)",
              fontFamily: "Manrope",
              fontSize: "0.95em",
              fontWeight: "400",
              marginLeft: "3.5em",
            },
          }}
        />
      </main>
    </>
  );
}

export default Login;
