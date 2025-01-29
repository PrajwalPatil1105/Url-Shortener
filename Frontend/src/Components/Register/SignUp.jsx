import React, { useState } from "react";
import styles from "../Styles/SignUp.module.css";
import { data, useNavigate } from "react-router";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

function SignUp() {
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [mobile, setmobile] = useState("");
  const [password, setpassword] = useState("");
  const [Compassword, setCompassword] = useState("");
  const [SerMsg, setSerMsg] = useState();
  const [nameErr, setnameErr] = useState("");
  const [emailErr, setemailErr] = useState("");
  const [mobileErr, setmobileErr] = useState("");
  const [passwordErr, setpasswordErr] = useState("");
  const [CompasswordErr, setCompasswordErr] = useState("");
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    name.length === 0 ? setnameErr("*Please Enter Name") : setnameErr("");
    password.length === 0
      ? setpasswordErr("*Please Enter Password")
      : setpasswordErr("");

    if (email.length === 0) {
      setemailErr("*Please Enter Email");
    } else if (!email.includes("@")) {
      setemailErr("*Enter Valid Email");
    } else {
      setemailErr("");
    }

    if (mobile.length === 0) {
      setmobileErr("*Please Enter Mobile Number");
    } else if (mobile.length < 10) {
      setmobileErr("*Please Enter Valid Number");
    } else {
      setmobileErr("");
    }

    if (password != Compassword) {
      setCompasswordErr("Password Did Not Match");
    } else {
      setCompasswordErr("");
    }

    if (
      name.length >= 1 &&
      email.length >= 3 &&
      mobile.length > 9 &&
      password.length >= 0 &&
      password === Compassword
    ) {
      try {
        const responce = await fetch(`${BASE_URL}auth/signup`, {
          method: "POST",
          headers: { "Content-type": "application/JSON" },
          body: JSON.stringify({ name, email, mobile, password }),
        });
        const data = await responce.json();
        if (data?.code === "1") {
          toast?.success(data?.message);
          setTimeout(() => {
            Login();
          }, 2000);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        toast.error("Sign Up failed. Please try again.");
      }
    }
  }

  function Login() {
    navigate("/Login");
  }

  useEffect(() => {
    if (SerMsg?.code === "1") {
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [SerMsg]);

  return (
    <>
      <main className={styles.main}>
        <section className={styles.Rightsection}>
          <img className={styles.Rightheading} src="./Images/Logo.png" alt="" />
          <img className={styles.Img1} src="./Images/MainImg.png" alt="" />
        </section>
        <section className={styles.Leftsection}>
          <div className={styles.navBtn}>
            <button className={styles.navBtn2}>SignUp</button>
            <button className={styles.navBtn1} onClick={Login}>
              Login
            </button>
          </div>
          <div className={styles.Leftmain}>
            <p className={styles.L1}>Join us Today!</p>

            <form onSubmit={handleSubmit}>
              <div className={styles.InputFields}>
                <input
                  className={styles.Nameinput}
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  placeholder="Name"
                />
                <span className={styles.errMsg}>{nameErr}</span>
              </div>
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
                  className={styles.Mobileinput}
                  type="text"
                  name="mobile"
                  value={mobile}
                  onChange={(e) => setmobile(e.target.value)}
                  placeholder="Mobile"
                />
                <span className={styles.errMsg}>{mobileErr}</span>
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

              <div className={styles.InputFields}>
                <input
                  className={styles.Passwordinput}
                  type="password"
                  value={Compassword}
                  onChange={(e) => setCompassword(e.target.value)}
                  placeholder="Confirm Password"
                />
                <span className={styles.errMsg}>{CompasswordErr}</span>
              </div>

              <button className={styles.SigninBtn}>Register</button>
              <p className={styles.L2}>
                Already have an account?{" "}
                <span className={styles.Signup} onClick={Login}>
                  Login
                </span>
              </p>
            </form>
          </div>
        </section>
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

export default SignUp;
