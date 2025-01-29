import React, { useEffect, useState } from "react";
import styles from "../Styles/DashboardPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faLink } from "@fortawesome/free-solid-svg-icons";

const DashboardPage = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkdata, setlinkdata] = useState("");
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  async function fetchlinkdata() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}url/DashboardData`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setlinkdata(data?.UserData || []);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Failed to fetch links");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchlinkdata();
  }, []);

  const [aggregatedStats, setAggregatedStats] = useState({
    totalClicks: 0,
    mobileClicks: 0,
    desktopClicks: 0,
    tabletClicks: 0,
  });
  useEffect(() => {
    if (linkdata && linkdata.length > 0) {
      const stats = linkdata.reduce(
        (acc, link) => ({
          totalClicks: acc.totalClicks + (link.totalClicks || 0),
          mobileClicks: acc.mobileClicks + (link.mobileClicks || 0),
          desktopClicks: acc.desktopClicks + (link.desktopClicks || 0),
          tabletClicks: acc.tabletClicks + (link.tabletClicks || 0),
        }),
        {
          totalClicks: 0,
          mobileClicks: 0,
          desktopClicks: 0,
          tabletClicks: 0,
        }
      );
      setAggregatedStats(stats);
      const earliestDate = new Date(
        Math.min(...linkdata.map((link) => new Date(link.createdAt)))
      );
      const today = new Date();
      const dateList = [];

      for (
        let d = new Date(earliestDate);
        d <= today;
        d.setDate(d.getDate() + 1)
      ) {
        const formattedDate = d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        });
        const dailyClicks = linkdata.reduce((total, link) => {
          const clicksOnDate = link.clickDetails.filter((click) => {
            const clickDate = new Date(click.clickedAt).toDateString();
            return clickDate === d.toDateString();
          }).length;
          return total + clicksOnDate;
        }, 0);
        dateList.push({ date: formattedDate, clicks: dailyClicks });
      }
      setDates(dateList.reverse());
    }
  }, [linkdata]);

  if (loading) {
    return (
      <div className={styles.mainContent}>
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>
            Loading, Please wait... &nbsp; &nbsp;
            <FontAwesomeIcon icon={faCircleNotch} spin />
          </p>
        </div>
      </div>
    );
  }

  if (!linkdata || linkdata.length === 0 || aggregatedStats.totalClicks === 0) {
    return (
      <div className={styles.mainContent}>
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>
            No link's click data found... ! &nbsp; &nbsp;
            <FontAwesomeIcon icon={faLink} />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mainContent}>
      <div className={styles.header}>
        <h2>Total Clicks</h2>
        <h3>{aggregatedStats.totalClicks}</h3>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <h4>Date-wise Clicks</h4>
          <ul>
            {dates.map(({ date, clicks }) => (
              <li className={styles.datalist} key={date}>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    gap: "1em",
                    justifyContent: "space-evenly",
                  }}
                >
                  <span className={styles.dates}>{date}</span>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.filled}
                      style={{
                        width: `${
                          (clicks / aggregatedStats.totalClicks) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <span>{clicks}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <h4>Click Devices</h4>
          <ul>
            <li className={styles.listItem}>
              <span className={styles.devicename}>Mobile</span>
              <div className={styles.progressBar}>
                <div
                  className={styles.filled}
                  style={{
                    width: `${
                      (aggregatedStats.mobileClicks /
                        aggregatedStats.totalClicks) *
                      100
                    }%`,
                  }}
                />
              </div>
              <span>{aggregatedStats.mobileClicks}</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.devicename}>Desktop</span>
              <div className={styles.progressBar}>
                <div
                  className={styles.filled}
                  style={{
                    width: `${
                      (aggregatedStats.desktopClicks /
                        aggregatedStats.totalClicks) *
                      100
                    }%`,
                  }}
                />
              </div>
              <span>{aggregatedStats.desktopClicks}</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.devicename}>Tablet</span>
              <div className={styles.progressBar}>
                <div
                  className={styles.filled}
                  style={{
                    width: `${
                      (aggregatedStats.tabletClicks /
                        aggregatedStats.totalClicks) *
                      100
                    }%`,
                  }}
                />
              </div>
              <span>{aggregatedStats.tabletClicks}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
