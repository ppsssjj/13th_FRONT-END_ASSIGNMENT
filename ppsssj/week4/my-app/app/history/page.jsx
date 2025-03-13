"use client";

import { useEffect, useState } from "react";
import styles from "./history.module.css";
import useServer from "./useServer";
import Alert from "@mui/material/Alert";
import { useAtom } from "jotai";
import { keyAtom } from "../store.jsx"; // Jotai keyAtom 가져오기

export default function History() {
    const [key] = useAtom(keyAtom); // Jotai에서 key 가져오기
    const [alertMessage, setAlertMessage] = useState("");
    const{ historyList,
        selectedHistory,
        handleSelect,
        handleDelete, 
        fetchHistory} = useServer();

    // 최초 렌더링 및 key 변경 시 데이터 가져오기
    useEffect(() => {
        fetchHistory();
    }, [key]);

    // selectedHistory 변경될 때 로그 출력
    useEffect(() => {
        console.log("현재 선택된 항목:", selectedHistory);
    }, [selectedHistory]);

    const handleDeleteClick = async() =>{
        await handleDelete();
        setAlertMessage("삭제 완료");
        setTimeout(()=>setAlertMessage(""), 2000);
    };

    return (
        <div className={styles.historyContainer}>
            <div className={styles.titleStyle}>"{key}" 님의 계산 기록</div>
            {alertMessage && <Alert variant="outlined" severity="success">{alertMessage}</Alert>}
            {historyList.map((history) => (
                <div key={history.id} className={styles.historyItem}>
                    <div className={styles.line}>
                        <input
                            type="checkbox"
                            className={styles.hiddenCheckbox}
                            onChange={() => handleSelect(history.id)}
                            checked={selectedHistory.includes(history.id)}
                        />
                        <div>{history.value}</div>
                    </div>
                </div>
            ))}
            <button className={styles.deleteButton} onClick={handleDeleteClick}>🗑️ Del</button>
        </div>
    );
}