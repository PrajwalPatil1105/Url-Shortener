import React, { useEffect, useState } from "react";
import styles from "../Styles/Analytics.module.css";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faLink,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function Analytics({ refresh }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analyticsdata, setanalyticsdata] = useState([]);
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    fetchlinkdata(currentPage);
  }, [currentPage, refresh]);

  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(currentPage + 1, totalPages - 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  async function fetchlinkdata(page = 1, limit = 6) {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      }).toString();
      const response = await fetch(
        `${BASE_URL}url/clickanalytics?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data?.code === "2") {
        toast.error("You Are Not Authorized, Please Login", {
          duration: 900,
        });
        setTimeout(() => {
          navigate("/login");
        }, 1300);
      } else {
        setanalyticsdata(data?.data || []);
        setTotalPages(data?.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Error fetching analytics data");
    } finally {
      setLoading(false);
    }
  }

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.mainContent}>
            <div className={styles.loadingContainer}>
              <p className={styles.loadingText}>
                Loading, Please wait... &nbsp; &nbsp;
                <FontAwesomeIcon icon={faCircleNotch} spin />
              </p>
            </div>
          </div>
        ) : analyticsdata.length === 0 ? (
          <div className={styles.mainContent}>
            <div className={styles.loadingContainer}>
              <p className={styles.loadingText}>
                No analytics data found &nbsp; &nbsp;
                <FontAwesomeIcon icon={faLink} />
              </p>
            </div>
          </div>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.columnDate}>Timestramp</th>
                  <th className={styles.columnOriginalLink}>Original Link</th>
                  <th className={styles.columnShortLink}>Short Link</th>
                  <th className={styles.columnIP}>IP Address</th>
                  <th className={styles.columnRemarks}>User Device</th>
                </tr>
              </thead>
              <tbody>
                {analyticsdata.map((item, index) => {
                  const formattedDate = new Date(item.clickedAt).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  );

                  return (
                    <tr key={index}>
                      <td className={styles.columnDate}>{formattedDate}</td>
                      <td className={styles.columnOriginalLink}>
                        <div className={styles.cellContent}>
                          {item.originalLink}
                        </div>
                      </td>
                      <td className={styles.columnOriginalLink}>
                        <div className={styles.cellContent}>
                          {item.hashedLink}
                        </div>
                      </td>
                      <td className={styles.columnRemarks}>
                        <div className={styles.cellContent}>
                          {item.ipAddress}
                        </div>
                      </td>
                      <td className={styles.columnOS}>{item.os}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!loading && analyticsdata.length > 0 && (
              <div className={styles.paginationContainer}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={styles.pageButton}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof page === "number" && handlePageChange(page)
                    }
                    disabled={page === "..."}
                    className={`${styles.pageButton} ${
                      currentPage === page ? styles.activePageButton : ""
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={styles.pageButton}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}
          </>
        )}
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
    </div>
  );
}

export default Analytics;
