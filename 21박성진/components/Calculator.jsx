import { useState } from "react";
import NumButton from "./NumButton";
import OpButton from "./OpButton";
import Display from "./Display";

export default function Calculator() {
  const [display, setDisplay] = useState("");
  const [firstValue, setFirstValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);

  function calculate(first, second, operator) {
    const num1 = parseFloat(first);
    const num2 = parseFloat(second);

    if (isNaN(num2)) return num1;

    switch (operator) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "*":
        return num1 * num2;
      case "/":
        return num2 !== 0 ? num1 / num2 : "Error";
      default:
        return second;
    }
  }

  function handleClearClick() {
    setDisplay("");
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecond(false);
  }

  function handleEqualsClick() {
    if (firstValue != null && operator !== null) {
      const result = calculate(firstValue, display, operator);
      setDisplay(result.toString());
      setFirstValue(result);
      setOperator(null);
      setWaitingForSecond(false);
    }
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

  return (
    <div className="calc">
      <Display value={display} />
      <div className="buttons_tool">
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
    </div>
  );
}
