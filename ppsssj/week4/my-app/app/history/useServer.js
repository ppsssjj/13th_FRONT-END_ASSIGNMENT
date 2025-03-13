"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { keyAtom } from "../store.jsx"; // Jotai에서 key 가져오기

const SERVER_URL = "http://iubns.net:7000/";

export default function useServer() {
    const [historyList, setHistoryList] = useState([]);
    const [selectedHistory, setSelectedHistory] = useState([]); //선택된 항목
    const [key] = useAtom(keyAtom) // 전역 상태에서 key 가져오기

    //서버에서 데이터 가져오기
    async function fetchHistory() {
        if (!key) return; // key가 없으면 실행 X

        try {
            console.log("~~>서버에서 데이터 가져오는 중...");
            const { data } = await axios.get(`${SERVER_URL}?key=${key}`);
            console.log("<~~서버에서 받은 데이터:", data);
            setHistoryList(data);
        } catch (error) {
            console.error("서버에서 데이터 가져오기 실패:", error);
        }
    }

    //서버에 데이터 추가하기
    async function postHistory(value) {
        if (!key) {
            console.error("Key 값이 설정되지 않았습니다.");
            return;
        }
        try {
            console.log("서버로 보낼 값:", value);
            await axios.post(SERVER_URL, { key, value });
            await fetchHistory(); // 데이터 추가 후 최신 목록 가져오기
        } catch (error) {
            console.error("서버에 데이터 추가 실패:", error);
        }
    }

     // 선택한 항목 저장
     function handleSelect(id) {
        setSelectedHistory((prevSelected) => {
            const newSelected = prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id) // 선택 해제
                : [...prevSelected, id]; // 선택 추가
            console.log("📌 선택된 수식 ID:", newSelected);
            return newSelected;
        });
    }

     // 삭제 기능
     async function handleDelete() {
        if (!key) return; // key가 없으면 실행하지 않음

        try {
            await Promise.all(
                selectedHistory.map((id) =>
                    axios.delete(`http://iubns.net:7000/?key=${key}&id=${id}`)
                )
            );
            setAlertMessage("✅ 삭제 완료!");
            console.log("📌 서버에서 항목 삭제 성공");
            //await fetchHistory(); // 최신 데이터 가져오기
            setSelectedHistory([]); // 선택 초기화
        } catch (error) {
            console.error("🚨 서버에서 항목 삭제 중 오류 발생:", error);
            setAlertMessage("❌ 삭제 실패!");
        }
    }

    useEffect(() => {
        fetchHistory();
    }, [key]); //key가 변경될 때마다 새로 불러오기

    return {
        historyList,
        selectedHistory,
        handleSelect,
        handleDelete,
        //setHistoryList, 
        postHistory,
        fetchHistory
    };
}

