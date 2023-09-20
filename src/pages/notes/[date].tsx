import { useSession } from "next-auth/react";
import { TextEditor } from "../../components/Editor/TextEditor";
import { NavBar } from "../../components/Nav/Nav";
import { DaysProps, SideCalendar } from "../../components/NewCalendar/Calendar";
import TodoList from "../../components/Todos/Todos";
import styles from "../index.module.css";
import React from "react";
import { api } from "~/utils/api";
import { PriorityQueueProvider } from "../../components/QueueContext/PriorityQueueContext";
import { useRouter } from "next/router";
import { Todos } from "@prisma/client";

export type SaveStatus = "save" | "canSave" | "nothingToSave";

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

const formatDate = (date: string) => new Date(date).toISOString().split("T")[0];

const getTimeDifference = (inputDate: Date): string => {
  const now = new Date();
  const timeDifference = now.getTime() - inputDate.getTime();
  const minutes = Math.floor(timeDifference / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    return minutes === 0
      ? "Just now"
      : `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
};

const getLastSaved = (todos: Todos[] | undefined) => {
  const lastSavedSort = todos?.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  if (lastSavedSort) {
    const updatedAt = lastSavedSort[0]?.updatedAt;
    return updatedAt ? getTimeDifference(new Date(updatedAt)) : "";
  }
};

const Notes = () => {
  const router = useRouter();
  const { date } = router.query;
  const dateFormatted = date as string;
  const dateFormattedAsDate = new Date(dateFormatted);

  const [saveStatus, setSaveStatus] =
    React.useState<SaveStatus>("nothingToSave");

  const {
    data: todos,
    isLoading: todosLoading,
    refetch,
  } = api.todo.getTodosByUserIdAndDate.useQuery({
    date: date ? new Date(dateFormatted) : new Date(),
  });

  const handleDayClick = (day: DaysProps) => {
    try {
      const updateSelectedDay = async () => {
        await router.push(`/notes/${formatDate(day.date) || ""}`, undefined, {
          shallow: true,
        });
        await refetch();
      };

      updateSelectedDay().catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  const [lastSaved, setLastSaved] = React.useState<string | undefined>(
    getLastSaved(todos)
  );

  React.useEffect(() => {
    setLastSaved(getLastSaved(todos));
    const timer = setTimeout(() => {
      setLastSaved(getLastSaved(todos));
    }, 60000);
    return () => clearTimeout(timer);
  }, [todos]);

  return (
    <PriorityQueueProvider>
      <div className={styles.notesMain}>
        <NavBar />
        <div className={styles.notesContainer}>
          <SideCalendar
            onEventClick={(day) => handleDayClick(day)}
            selectedDay={dateFormattedAsDate ?? undefined}
          />
          <div className={styles.markdownContainer}>
            <div className={styles.topRow}>
              <div className={styles.dayTitle}>
                {getDayString(dateFormattedAsDate)}
              </div>
              <div className={styles.saveBox}>
                {saveStatus === "canSave" && (
                  <div>
                    <button
                      className={styles.saveButton}
                      onClick={() => setSaveStatus("save")}
                    >
                      Save
                    </button>
                  </div>
                )}
                {lastSaved && <div>Last saved: {lastSaved}</div>}
              </div>
            </div>
            <div className={styles.markdownContent}>
              <div className={styles.markdownItem}>
                <div>Your todos</div>
                <TodoList
                  selectedDate={dateFormattedAsDate}
                  data={todos}
                  loading={todosLoading}
                  saveStatus={saveStatus}
                  setSaveStatus={setSaveStatus}
                  // eslint-disable-next-line @typescript-eslint/no-misused-promisesVERCEL_URL
                  refetch={refetch}
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
