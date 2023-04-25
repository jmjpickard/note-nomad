import { TextEditor } from "./components/Editor/TextEditor";
import { NavBar } from "./components/Nav/Nav";
import { DaysProps, SideCalendar } from "./components/NewCalendar/Calendar";
import TodoList from "./components/Todos/Todos";
import styles from "./index.module.css";
import React from "react";

const nth = function (d: number) {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const getDayString = (date: Date) => {
  const day = date.toLocaleDateString("en-GB", {
    day: "numeric",
    weekday: "long",
  });
  const endStr = nth(date.getDate());
  return `${day}${endStr}`;
};

const Notes = () => {
  const [selectedDay, setSelectedDay] = React.useState<Date>(new Date());
  const handleDayClick = (day: DaysProps) => {
    setSelectedDay(new Date(day.date));
  };
  return (
    <div className={styles.notesMain}>
      <NavBar />
      <div className={styles.notesContainer}>
        <SideCalendar
          onEventClick={(day) => handleDayClick(day)}
          selectedDay={selectedDay}
        />
        <div className={styles.markdownContainer}>
          <div className={styles.dayTitle}>{getDayString(selectedDay)}</div>
          <div className={styles.markdownContent}>
            <div className={styles.markdownItem}>
              <div>Todos</div>
              <TodoList />
            </div>
            <div className={styles.markdownItem}>
              <div>Notes</div>
              <div className={styles.editor}>
                <TextEditor />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
