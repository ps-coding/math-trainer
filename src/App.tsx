import "./App.css";

import { useEffect, useRef, useState } from "react";

const operations = ["+", "-", "*", "/"] as const;
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
  } else {
    answer = randomNumBetween(1, 10 * maxDifficulty);
    secondNum = randomNumBetween(1, 10 * maxDifficulty);
    firstNum = answer + secondNum;
  }

  return { firstNum, secondNum, operation, answer };
}

export default function App() {
  const [correct, setCorrect] = useState(0);
  const [problem, setProblem] = useState(getProblem(correct));
  const { firstNum, secondNum, operation, answer } = problem;
  const input = useRef<HTMLInputElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const levelRef = useRef<HTMLHeadingElement>(null);
  const timeRef = useRef<HTMLParagraphElement>(null);
  const timer = useRef<number>();
  const [time, setTime] = useState(10);

  useEffect(() => {
    setProblem(getProblem(correct));
  }, [correct]);

  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.innerText = `${firstNum} ${operation} ${secondNum}`;
    }
  }, [problem]);

  useEffect(() => {
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
              "<br />(" +
              firstNum +
              " " +
              operation +
              " " +
              secondNum +
              ")";
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
      if (questionRef.current) {
        questionRef.current.innerText = "Correct!";
      }
      setTimeout(() => {
        setCorrect((correct) => correct + 1);
        if (input.current) {
          input.current.value = "";
        }
      }, 350);
    }
  }

  return (
    <>
      <h1 ref={questionRef}>
        {firstNum} {operation} {secondNum}
      </h1>
      <h2 ref={levelRef}>Level: {correct} </h2>
      <input
        type="number"
        onInput={checkCorrect}
        ref={input}
        autoFocus
        placeholder="Answer"
      />
      <p ref={timeRef}>
        Time Remaining: {time} {time == 1 ? "second" : "seconds"}
      </p>
    </>
  );
}
