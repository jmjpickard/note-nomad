import { useSession } from "next-auth/react";
import { TextEditor } from "../components/Editor/TextEditor";
import { NavBar } from "../components/Nav/Nav";
import { DaysProps, SideCalendar } from "../components/NewCalendar/Calendar";
import TodoList from "../components/Todos/Todos";
import styles from "./index.module.css";
import React from "react";
import { api } from "~/utils/api";
import { PriorityQueueProvider } from "../components/QueueContext/PriorityQueueContext";

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

const dateOnly = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const Notes = () => {
  const [selectedDay, setSelectedDay] = React.useState<Date>(
    dateOnly(new Date())
  );

  const {
    data: todos,
    isLoading: todosLoading,
    refetch,
  } = api.todo.getTodosByUserIdAndDate.useQuery({ date: selectedDay });

  const handleDayClick = async (day: DaysProps) => {
    setSelectedDay(dateOnly(new Date(day.date)));
    await refetch();
  };

  return (
    <PriorityQueueProvider>
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
                <TodoList
                  selectedDate={selectedDay}
                  data={todos}
                  loading={todosLoading}
                />
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
    </PriorityQueueProvider>
  );
};

export default Notes;
