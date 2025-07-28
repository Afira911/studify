import React, { useState, useEffect } from "react";
import "./Pomodoro.css";

const Pomodoro = () => {
  const [step, setStep] = useState(() => localStorage.getItem("step") || "setTask");
  const [task, setTask] = useState(() => localStorage.getItem("taskValue") || "");
  const [taskInput, setTaskInput] = useState("");
  const [loopCount, setLoopCount] = useState(() => Number(localStorage.getItem("loopCount")) || 1);
  const [currentLoop, setCurrentLoop] = useState(() => Number(localStorage.getItem("currentLoop")) || 1);
  const [timeLeft, setTimeLeft] = useState(() => Number(localStorage.getItem("timeLeft")) || 25 * 60);
  const [completed, setCompleted] = useState(() => localStorage.getItem("completed") === "true");

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("step", step);
    localStorage.setItem("taskValue", task);
    localStorage.setItem("loopCount", loopCount);
    localStorage.setItem("currentLoop", currentLoop);
    localStorage.setItem("timeLeft", timeLeft);
    localStorage.setItem("completed", completed);
  }, [step, task, loopCount, currentLoop, timeLeft, completed]);

  // Timer logic
  useEffect(() => {
    if (step !== "focus" && step !== "break") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (step === "focus") {
            setStep("stopWork");
          } else if (step === "break") {
            if (currentLoop >= loopCount) {
              setCompleted(true);
              setStep("completed");
            } else {
              setStep("stopBreak");
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const handleSetTask = () => {
    localStorage.setItem("taskValue", taskInput);
    setTask(taskInput);
    setTimeLeft(25 * 60);
    setStep("focus");
  };

  const handleRestart = () => {
    setTask("");
    setTaskInput("");
    setLoopCount(1);
    setCurrentLoop(1);
    setTimeLeft(25 * 60);
    setStep("setTask");
    setCompleted(false);

    localStorage.removeItem("taskValue");
    localStorage.removeItem("loopCount");
    localStorage.removeItem("currentLoop");
    localStorage.removeItem("step");
    localStorage.removeItem("timeLeft");
    localStorage.removeItem("completed");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const AlarmSound = () => (
    <audio src="./assets/clock_alarm.wav" autoPlay style={{ display: "none" }} />
  );

  const playClickSound = () => {
    const clickSound = new Audio("./assets/click.mp3");
    clickSound.play();
  };

  const handlePomodoroReset = () => {
    setTask("");
    setTaskInput("");
    setLoopCount(1);
    setCurrentLoop(1);
    setTimeLeft(25 * 60);
    setStep("setTask");
    setCompleted(false);

    localStorage.removeItem("taskValue");
    localStorage.removeItem("loopCount");
    localStorage.removeItem("currentLoop");
    localStorage.removeItem("step");
    localStorage.removeItem("timeLeft");
    localStorage.removeItem("completed");
  };

  return (
    <>
      {step === "setTask" && (
        <div className="setTaskDiv">
          <h1>SET YOUR TASK</h1>
          <img src="./assets/crayonPomo.png" alt="Pomodoro Crayon" />
          <p>
            Write down the task you want to achieve<br />
            during this session.
          </p>
          <input
            className="taskInput"
            type="text"
            placeholder="Write your task here..."
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            size="25"
          />
          <br />
          <p>How many Pomodoro sessions?</p>
          <input
            className="sessionInput"
            type="number"
            min="1"
            max="10"
            value={loopCount}
            onChange={(e) => {
              const val = Math.max(1, Number(e.target.value));
              setLoopCount(val);
            }}
          />
          <br />
          <button
            className="main-btn"
            onClick={() => {
              handleSetTask();
              playClickSound();
            }}
          >
            SET TIMER
          </button>
        </div>
      )}
    
      {step === "focus" && (
        <div className="timerBeginsDiv">
          <h1>LET'S GO!</h1>
          <p className="taskText">{task}</p>
          <p className="timerText">{formatTime(timeLeft)}</p>
          <p>Session {currentLoop} of {loopCount}</p>
          <img src="./assets/TomatoWaitFun.gif" alt="Pomodoro Crayon" />
          <img 
            className="restart-icon" 
            src="/assets/restart-icon.png" 
            alt="Reset Pomodoro" 
            onClick={() => {
              playClickSound();    
              handlePomodoroReset(); 
            }} 
          />
        </div>
      )}

      {step === "stopWork" && (
        <div className="stopWorkDiv">
          <AlarmSound />
          <h1>BREAK TIME!</h1>
          <p className="taskText">{task}</p>
          <p className="timerText">00:00</p>
          <p>Session {currentLoop} of {loopCount}</p>
          <button
            className="main-btn"
            onClick={() => {
              setTimeLeft(5 * 60);
              setStep("break");
              playClickSound();
            }}
          >
            START BREAK
          </button>
          <img 
            className="restart-icon" 
            src="/assets/restart-icon.png"
            alt="Reset Pomodoro" 
            onClick={() => {
              playClickSound();    
              handlePomodoroReset(); 
            }}  
          />
        </div>
      )}

      {step === "break" && (
        <div className="takingBreakDiv">
          <h1>TAKING A BREAK...</h1>
          <p className="taskText">{task}</p>
          <p className="timerText">{formatTime(timeLeft)}</p>
          <p>Session {currentLoop} of {loopCount}</p>
          <img src="./assets/tomatoSleep.gif" alt="Pomodoro Sleep" />
          <img 
            className="restart-icon" 
            src="/assets/restart-icon.png" 
            alt="Reset Pomodoro" 
            onClick={() => {
              playClickSound();    // Mainkan suara klik
              handlePomodoroReset(); // Reset timer
            }} 
          />
        </div>
      )}

      {step === "stopBreak" && (
        <div className="stopBreakDiv">
          <AlarmSound />
          <h1>BACK TO WORK!</h1>
          <p className="taskText">{task}</p>
          <p className="timerText">00:00</p>
          <p>Session {currentLoop} of {loopCount}</p>
          <button
            className="main-btn"
            onClick={() => {
              setCurrentLoop((prev) => prev + 1);
              setTimeLeft(25 * 60);
              setStep("focus");
              playClickSound();
            }}
          >
            START TIMER
          </button>
          <img 
            className="restart-icon" 
            src="/assets/restart-icon.png" 
            alt="Reset Pomodoro" 
            onClick={() => {
              playClickSound();    // Mainkan suara klik
              handlePomodoroReset(); // Reset timer
            }}  
          />
        </div>
      )}

      {step === "completed" && completed && (
        <div className="completedDiv">
          <AlarmSound />
          <h1>ALL POMODORO SESSIONS COMPLETED!</h1>
          <p>You Finally Finish The Session Of</p>
          <p><strong>{task}</strong></p>
          <img src="./assets/tomatoCelebrate.gif" alt="Pomodoro Celebrate" />
          <button
            className="main-btn"
            onClick={() => {
              handleRestart();
              playClickSound();
            }}
          >
            START AGAIN
          </button>
        </div>
      )}
    </>
  );
};

export default Pomodoro;
