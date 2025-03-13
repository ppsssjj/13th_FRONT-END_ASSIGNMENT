"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css"; 
import { useRouter } from "next/navigation";
import useServer from "./history/useServer"; 
import { Modal, Box, TextField, Button } from "@mui/material"; 
import { useAtom } from "jotai";
import { keyAtom } from "./store.jsx"; //Jotai에서 keyAtom 가져오기

function NumButton({ value, onClick }) {
  return (
    <div className={styles.num_buttons} onClick={() => onClick(value)}>
      {value}
    </div>
  );
}

function OpButton({ value, onClick }) {
  return (
    <div className={styles.op_buttons} onClick={() => onClick(value)}>
      {value}
    </div>
  );
}

export default function Calculator() {
  const [display, setDisplay] = useState(""); //빈 문자열
  const [firstValue, setFirstValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);
  const [key, setKey] = useAtom(keyAtom); //전역 상태로 key 관리
  const [openKeyModal, setOpenKeyModal] = useState(true); //Modal 상태
  const[tempKey, setTempKey] = useState("");
  const { postHistory } = useServer();  
  const { push } = useRouter();

  const handleKeySubmit = () => { //Key 입력창 닫기
    if (tempKey) { 
      setOpenKeyModal(false);
      setKey(tempKey);
      console.log("📌 설정된 계산기 Key:", tempKey);
    }
  };

  function calculate(first, second, operator) {
    const num1 = parseFloat(first);
    const num2 = parseFloat(second);

    if (isNaN(num2)) return num1;

    switch (operator) {
      case "+": return num1 + num2;
      case "-": return num1 - num2;
      case "*": return num1 * num2;
      case "/": return num2 !== 0 ? num1 / num2 : "Error";
      default: return second;
    }
  }

  function handleClearClick() {
    setDisplay("");
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecond(false);
  }

  function handleEqualsClick() {
    if (firstValue == null || operator === null) return;
  
    const result = calculate(firstValue, display, operator);
    setDisplay(result.toString());
    setFirstValue(result);
    setOperator(null);
    setWaitingForSecond(false);
  
    const expression = `${firstValue} ${operator} ${display} = ${result}`;
    console.log("📌 전송할 데이터:", expression);
    postHistory(expression);
  }

  function handleNumClick(value) {
    if (waitingForSecond) {
      setDisplay(value);
      setWaitingForSecond(false);
    } else {
      setDisplay((prev) => (prev === "0" ? value : prev + value));
    }
  }

  function handleOpClick(value) {
    if (firstValue === null) {
      setFirstValue(display);
    } else if (!waitingForSecond) {
      const result = calculate(firstValue, display, operator);
      setFirstValue(result);
      setDisplay(result.toString());
    }
    setOperator(value);
    setWaitingForSecond(true);
  }

  function goToHistoryPage() {
    push("/history");
  }

  return (
    <div className={styles.calc}>
      <Modal open={openKeyModal} onClose={() => setOpenKeyModal(false)}>
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          borderRadius: 3,
          transform: 'translate(-50%, -50%)', 
          bgcolor: 'background.paper', 
          padding: 4,
          boxShadow: 24,
          width: 300,
        }}>
          <TextField
            label="계산기 Key"
            variant="outlined"
            fullWidth
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)} 
          />
          <Button 
            variant="outlined" 
            onClick={handleKeySubmit}
            fullWidth
            sx={{ marginTop: 2 }}
          >
            확인
          </Button>
        </Box>
      </Modal>
      <div className={styles.display}>{display}</div>
      <div className={styles.buttons_tool}>
        <div style={{ display: "flex" }}>
          <NumButton value="." onClick={handleNumClick} />
          <OpButton value="AC" onClick={handleClearClick} />
          <OpButton value="=" onClick={handleEqualsClick} />
          <OpButton value="/" onClick={handleOpClick} />
        </div>
        <div style={{ display: "flex" }}>
          <NumButton value="7" onClick={handleNumClick} />
          <NumButton value="8" onClick={handleNumClick} />
          <NumButton value="9" onClick={handleNumClick} />
          <OpButton value="*" onClick={handleOpClick} />
        </div>
        <div style={{ display: "flex" }}>
          <NumButton value="4" onClick={handleNumClick} />
          <NumButton value="5" onClick={handleNumClick} />
          <NumButton value="6" onClick={handleNumClick} />
          <OpButton value="-" onClick={handleOpClick} />
        </div>
        <div style={{ display: "flex" }}>
          <NumButton value="1" onClick={handleNumClick} />
          <NumButton value="2" onClick={handleNumClick} />
          <NumButton value="3" onClick={handleNumClick} />
          <OpButton value="+" onClick={handleOpClick} />
        </div>
      </div>
      <button onClick={goToHistoryPage}>페이지 이동</button>
    </div>
  );
}