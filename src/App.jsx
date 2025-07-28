import React, { useState } from 'react';
import Pomodoro from './components/Pomodoro';
import TaskList from './components/taskList';

function App() {
  const [showPomodoro, setShowPomodoro] = useState(true);

  const handleToggle = () => {
    const clickSound = new Audio('/assets/click.mp3'); // Make sure path is public!
    clickSound.volume = 0.3;
    clickSound.play();
    setShowPomodoro(prev => !prev);
  };

  return (
    <div className={showPomodoro ? "app pomodoro-bg" : "app tasklist-bg"}>
      <button className="toggle-btn" onClick={handleToggle}>
        <img
          className="toggle-icon"
          src={showPomodoro ? '/assets/task-icon.png' : '/assets/pomodoro-icon.png'}
          alt="Toggle View"
        />
      </button>
      {showPomodoro ? <Pomodoro /> : <TaskList />}
    </div>
  );
}

export default App;