"use client";
import { useState, useEffect } from "react";
import axios from "axios";

//서버 주소를 전역 변수로 설정
const SERVER_URL = "http://iubns.net:7000/";

export default function useServer() {
    const [historyList, setHistoryList] = useState([]); //서버 데이터
    const [selectedHistory, setSelectedHistory] = useState([]); //선택된 항목

    //서버에서 데이터 가져오기
    async function fetchHistory() {
        try {
            console.log("서버에서 데이터 가져오는 중...");
            const { data } = await axios.get(`${SERVER_URL}?key=sungjin`);
            console.log("서버에서 받은 데이터:", data);
            setHistoryList(data); //데이터 업데이트
        } catch (error) {
            console.error("서버에서 데이터 가져오기 실패:", error);
        }
    }

    //서버에 데이터 추가하기
    async function postHistory(value) {
        try {
            console.log("서버로 보낼 값:", value);
            await axios.post(SERVER_URL, { key: "sungjin", value });
            await fetchHistory(); //데이터 추가 후 최신 목록 가져오기
        } catch (error) {
            console.error("서버에 데이터 추가 실패:", error);
        }
    }

    //선택한 항목 저장
    function handleSelect(id) {
        setSelectedHistory((prevSelected) => {
            const newSelected = prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id) // 선택 해제
                : [...prevSelected, id]; //선택 추가
            console.log("선택된 수식 ID:", newSelected);
            return newSelected;
        });
    }

    //삭제 기능
    async function handleDelete() {
        try {
            await Promise.all(
                selectedHistory.map((id) =>
                    axios.delete(`${SERVER_URL}?key=sungjin&id=${id}`)
                )
            );
            console.log("서버에서 항목 삭제 성공");
            await fetchHistory(); //최신 데이터 가져오기
            setSelectedHistory([]); //선택 초기화
        } catch (error) {
            console.error("서버에서 항목 삭제 중 오류 발생:", error);
        }
    }

    // 컴포넌트 마운트 시 데이터 가져오기
    useEffect(() => {
        fetchHistory();
    }, []);

    return {
        historyList,
        selectedHistory,
        handleSelect,
        handleDelete,
        postHistory,
        fetchHistory,
    };
}
