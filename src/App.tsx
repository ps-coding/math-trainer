import { useEffect, useRef, useState } from 'react';
import './App.css'

const operations = ["+", "-", "*", "/"] as const;
type Operation = typeof operations[number];
type Problem = { firstNum: number, secondNum: number, operation: Operation, answer: number }

function randomNumBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
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

function App() {
  const [correct, setCorrect] = useState(0);
  const [problem, setProblem] = useState(getProblem(correct));
  const { firstNum, secondNum, operation, answer } = problem;
  const input = useRef();
  const title = useRef();

  useEffect(() => {
    setProblem(getProblem(correct));
  }, [correct]);

  useEffect(() => {
    title.current.innerText = `${firstNum} ${operation} ${secondNum}`;
  }, [problem]);

  function checkCorrect(event: any) {
    if (event.target.value == answer.toString()) {
      title.current.innerText = "Correct!";
      setTimeout(() => {
        setCorrect((correct) => correct + 1);
        input.current.value = "";
      }, 350);
    }
  }

  return (
    <>
      <h1 ref={title}>{firstNum} {operation} {secondNum}</h1>
      <h2>{correct ? <span>You have answered {correct} correctly!</span> : <span>Answer your first question!</span>}</h2>
      <input type="number" onInput={checkCorrect} ref={input} autoFocus placeholder='Answer' />
    </>
  );
}

export default App;
