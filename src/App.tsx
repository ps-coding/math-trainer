import "./App.css";

import { useEffect, useRef, useState } from "react";

const operations = ["+", "-", "*", "/", "^", "√"] as const;
type Operation = typeof operations[number];
type Problem = {
  firstNum: number;
  secondNum: number;
  operation: Operation;
  answer: number;
};

function randomNumBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getProblem(maxDifficulty: number): Problem {
  const operation = operations[randomNumBetween(0, operations.length - 1)];
  let firstNum: number;
  let secondNum: number;
  let answer: number;

  if (operation == "+") {
    firstNum = randomNumBetween(1, 10 * maxDifficulty);
    secondNum = randomNumBetween(1, 10 * maxDifficulty);
    answer = firstNum + secondNum;
  } else if (operation == "*") {
    firstNum = randomNumBetween(1, 10 * maxDifficulty);
    secondNum = randomNumBetween(1, 10 * maxDifficulty);
    answer = firstNum * secondNum;
  } else if (operation == "/") {
    answer = randomNumBetween(1, 10 * maxDifficulty);
    secondNum = randomNumBetween(1, 10 * maxDifficulty);
    firstNum = answer * secondNum;
  } else if (operation == "-") {
    answer = randomNumBetween(1, 10 * maxDifficulty);
    secondNum = randomNumBetween(1, 10 * maxDifficulty);
    firstNum = answer + secondNum;
  } else if (operation == "^") {
    firstNum = randomNumBetween(1, 2 * Math.ceil(maxDifficulty / 2));
    secondNum = randomNumBetween(1, 1 * Math.ceil(maxDifficulty / 2));
    answer = Math.pow(firstNum, secondNum);
  } else {
    answer = randomNumBetween(1, 2 * Math.ceil(maxDifficulty / 2));
    firstNum = randomNumBetween(1, 1 * Math.ceil(maxDifficulty / 2));
    secondNum = Math.pow(answer, firstNum);
  }

  return { firstNum, secondNum, operation, answer };
}

export default function App() {
  const [correct, setCorrect] = useState(0);
  const [problem, setProblem] = useState(getProblem(correct) as Problem);
  const { firstNum, secondNum, operation, answer } = problem;
  const input = useRef<HTMLInputElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const levelRef = useRef<HTMLHeadingElement>(null);
  const timeRef = useRef<HTMLParagraphElement>(null);
  const timer = useRef<number>();
  const [time, setTime] = useState(10);

  useEffect(() => {
    setProblem(getProblem(correct));
    setTime(10);
  }, [correct]);

  useEffect(() => {
    if (time > 0) {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else {
      clearTimeout(timer.current);
      setCorrect((correct) => {
        if (correct == 0) {
          if (questionRef.current) {
            questionRef.current.innerHTML =
              "Game Over!" +
              "<br />" +
              `<span class="problem"><span class=${operation == "√" ? "r-index" : ""}>${(operation != "√" || firstNum != 2) ? firstNum : ""}</span><span class=${"operation" + (operation != "√" ? " space" : "")}>${operation}</span><span class=${operation == "√" ? "r-radicand" : ""}>${secondNum}</span>&nbsp;=</span>`;
          }

          if (input.current) {
            input.current.value = answer.toString();
            input.current.disabled = true;
          }

          if (levelRef.current) {
            levelRef.current.innerText = "Refresh to play again.";
          }

          if (timeRef.current) {
            timeRef.current.innerText = "Time's up!";
          }

          return 0;
        }

        return correct - 1;
      });
    }
  }, [time]);

  function checkCorrect(event: React.FormEvent<HTMLInputElement>) {
    if (event.currentTarget.value == answer.toString()) {
      if (input.current) {
        input.current.type = "text";
        input.current.value = "Correct!";
        input.current.disabled = true;
      }
      setTimeout(() => {
        setCorrect((correct) => correct + 1);
        if (input.current) {
          input.current.disabled = false;
          input.current.textContent = "";
          input.current.type = "number";
          input.current.focus();
        }
      }, 350);
    }
  }

  return (
    <>
      <h1 ref={questionRef}>
        <span className="problem"><span className={operation == "√" ? "r-index" : ""}>{(operation != "√" || firstNum != 2) ? firstNum : ""}</span><span className={"operation" + (operation != "√" ? " space" : "")}>{operation}</span><span className={operation == "√" ? "r-radicand" : ""}>{secondNum}</span>&nbsp;=</span>
      </h1>
      <input
        type="number"
        onInput={checkCorrect}
        ref={input}
        autoFocus
        placeholder="Answer"
      />
      <h2 ref={levelRef}>Level: {correct + 1}</h2>
      <p ref={timeRef}>
        Time Remaining: {time} {time == 1 ? "second" : "seconds"}
      </p>
    </>
  );
}
