// src/components/TaskList.jsx
import React, { useState, useEffect } from 'react';
import './taskList.css';

const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function TaskList() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [checked, setChecked] = useState(() => {
    const saved = localStorage.getItem("checkedTasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [date, setDate] = useState({ day: "", date: "", month: "" });
  const [finished, setFinished] = useState(false);

  // Set date on first load
  useEffect(() => {
    const now = new Date();
    setDate({
      day: weekday[now.getDay()],
      date: now.getDate(),
      month: month[now.getMonth()]
    });
  }, []);

  // Save to localStorage whenever tasks or checked state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("checkedTasks", JSON.stringify(checked));
  }, [tasks, checked]);

  const handleAddTask = () => {
    if (input.trim() !== "" && tasks.length < 7) {
      setTasks([...tasks, input]);
      setInput('');
    }
  };

  const toggleTask = (index) => {
    setChecked(prev => (
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    ));
  };

  const handleFinishDay = () => {
    setFinished(true);
  };

  const handleRestart = () => {
    setFinished(false);
    setTasks([]);
    setChecked([]);
    setInput('');
    localStorage.removeItem("tasks");
    localStorage.removeItem("checkedTasks");
  };

  const progress = tasks.length > 0 ? (checked.length / tasks.length) * 100 : 0;

  return (
    <div className={finished ? "finalDiv" : "dashDiv"}>
      {finished ? (
        <>
          <h1 id="final-title">{progress === 100 ? "You're doing good!" : "Keep going!"}</h1>
          <div className="center-image">
            <img
              src={progress === 100 ? "/assets/FinishGood.png" : "/assets/FinishMid.png"}
              alt="Result"
            />
          </div>
          <span id="conclusion">Your final progress: {Math.round(progress)}%</span>
          <button id="restart-btn" onClick={handleRestart}>BACK HOME</button>
        </>
      ) : (
        <>
          <div className="top-section">
            <div className="datetime">
              <span id="day">{date.day}</span>
              <span id="number">{date.date}</span>
              <span id="month">{date.month}</span>
            </div>
            <div className="right-section">
              <div className="progression">
                <h3>Progression</h3>
                <progress id="progress-bar" value={progress} max="100"></progress>
              </div>
              <div className="add-task">
                <input
                  type="text"
                  placeholder="Write your task here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button id="add-btn" onClick={handleAddTask}>+</button>
              </div>
            </div>
          </div>

          <div className="bottom-section">
            {Array.from({ length: 7 }).map((_, i) => (
              <p key={i} onClick={() => toggleTask(i)} className={checked.includes(i) ? "checked done" : ""}>
                <i className='bx bxs-leaf'></i>
                <span>{tasks[i] || ""}</span>
              </p>
            ))}
          </div>

          <button id="finish-btn" onClick={handleFinishDay}>FINISH DAY</button>
        </>
      )}
    </div>
  );
}

export default TaskList;
