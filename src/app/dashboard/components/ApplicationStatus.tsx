"use client";

import React, { useEffect, useState } from "react";
import styles from "./ApplicationStatus.module.css";

type StatusData = {
    round1Passed: boolean;
    round2Passed: boolean;
};

export default function ApplicationStatus() {
    const [status, setStatus] = useState<StatusData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch("/api/dashboard-status");
                const data = await res.json();
                if (data.success) {
                    setStatus({
                        round1Passed: data.round1Passed,
                        round2Passed: data.round2Passed,
                    });
                }
            } catch (error) {
                console.error("Error fetching status:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    if (loading) return null; // Or a skeleton loader
    if (!status) return null;

    const showScheduleButton = status.round1Passed && status.round2Passed;

    return (
        <div className={styles.statusContainer}>
            <div className={styles.cardsWrapper}>
                <div className={styles.statusCard}>
                    <div className={styles.cardContent}>
                        <h3>Round 1</h3>
                        <p>Initial Screening</p>
                    </div>
                    <div
                        className={`${styles.statusBadge} ${status.round1Passed ? styles.passed : styles.notPassed
                            }`}
                    >
                        {status.round1Passed ? "Passed" : "Not Passed"}
                    </div>
                </div>

                <div className={styles.statusCard}>
                    <div className={styles.cardContent}>
                        <h3>Round 2</h3>
                        <p>Technical Assessment</p>
                    </div>
                    <div
                        className={`${styles.statusBadge} ${status.round2Passed ? styles.passed : styles.notPassed
                            }`}
                    >
                        {status.round2Passed ? "Passed" : "Not Passed"}
                    </div>
                </div>
            </div>

            {showScheduleButton && (
                <div className={styles.scheduleButtonContainer}>
                    <button
                        className={styles.scheduleButton}
                        onClick={() => alert("Redirecting to interview scheduler...")} // Placeholder action
                    >
                        Schedule Interview
                    </button>
                </div>
            )}
        </div>
    );
}
