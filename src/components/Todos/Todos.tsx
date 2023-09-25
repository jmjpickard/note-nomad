import React from "react";
import styles from "./todos.module.css";
import { Todos } from "@prisma/client";
import cuid from "cuid";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import InactivityTrigger from "../InactivityTrigger/InactivityTrigger";
import { usePriorityQueue } from "../QueueContext/PriorityQueueContext";
import { saveToDatabase } from "./utils";
import { SaveStatus } from "~/pages/notes/[date]";

interface TodoListProps {
  selectedDate: Date;
  data?: Todos[];
  loading: boolean;
  saveStatus: SaveStatus;
  setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
  refetch: () => void;
}

interface TodoWithAction extends Todos {
  index: number;
  action: "upsert" | "delete";
}

const TodoList: React.FC<TodoListProps> = ({
  selectedDate,
  data,
  loading,
  saveStatus,
  setSaveStatus,
  refetch,
}: TodoListProps) => {
  const { enqueue, dequeue, length, queue } =
    usePriorityQueue<TodoWithAction>();
  const session = useSession();

  const [todos, setTodos] = React.useState<Todos[]>([]);

  React.useEffect(() => {
    if (data) {
      if (data.length === 0) {
        setTodos([
          {
            id: cuid(),
            title: "",
            userId: session?.data?.user.id ?? "",
            date: selectedDate,
            createdAt: new Date(),
            updatedAt: new Date(),
            content: "",
            done: false,
            order: 0,
          },
        ]);
      } else {
        setTodos(data);
      }
    }
  }, [data]);

  const upsertTodo = api.todo.upsertTodo.useMutation();
  const deleteTodo = api.todo.deleteTodo.useMutation();

  const inputRefs = React.useRef<HTMLInputElement[]>([]);
  const [focusIndex, setFocusIndex] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (focusIndex !== null && inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex]?.focus();
    }
  }, [focusIndex, inputRefs.current]);

  const handleCheckboxChange = (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      const updatedTodo = { ...todo, done: !todo.done };
      setTodos((todos) => {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        );
        return updatedTodos;
      });
      enqueue({
        action: "upsert",
        ...updatedTodo,
        index: length + 1,
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      const updatedTodo = { ...todo, content: e.target.value };
      setTodos((todos) => {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        );
        return updatedTodos;
      });
      enqueue({
        action: "upsert",
        ...updatedTodo,
        index: length + 1,
      });
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    index: number
  ) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      const updatedTodo = { ...todo, content: e.currentTarget.value };
      setTodos((todos) => {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        );
        return updatedTodos;
      });
      enqueue({
        action: "upsert",
        ...updatedTodo,
        index: length + 1,
      });
      if (e.key === "Enter") {
        e.preventDefault();
        setTodos((todos) => [
          ...todos,
          {
            id: cuid(),
            title: "",
            userId: session?.data?.user.id ?? "",
            date: selectedDate,
            createdAt: new Date(),
            updatedAt: new Date(),
            content: "",
            done: false,
            order: index + 1,
          },
        ]);
        setFocusIndex(index + 1);
      }
      if (e.key === "Backspace") {
        if (e.currentTarget.value.length === 0) {
          setTodos(todos.filter((t) => t.id !== id));
          setFocusIndex(index - 1);
          inputRefs.current.splice(index, 1);
          const todo = todos.find((todo) => todo.id === id);
          if (todo) {
            enqueue({
              action: "delete",
              ...todo,
              index: length + 1,
            });
          }
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        setSaveStatus("save");
      }
    }
  };

  React.useEffect(() => {
    if (queue.length > 0) {
      setSaveStatus("canSave");
    }
    if (saveStatus === "save") {
      saveToDatabase({
        todos,
        setTodos,
        dequeue,
        upsertTodo,
        deleteTodo,
        refetch,
      });
      setSaveStatus("nothingToSave");
    }
  }, [saveStatus, todos]);

  return (
    <>
      <div className={styles.todoList}>
        {loading && <div>Loading...</div>}
        {todos
          .sort((a, b) => (a.order > b.order ? 1 : 0))
          .map((todo, index) => (
            <div className={styles.todoItem} key={todo.id}>
              <div className={styles.checkContainer}>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => null}
                />
                <span
                  className={styles.checkmark}
                  onClick={() => handleCheckboxChange(todo.id)}
                ></span>
              </div>
              <input
                type="text"
                value={todo.content ?? ""}
                onChange={(e) => handleInputChange(e, todo.id)}
                onKeyDown={(e) => handleKeyPress(e, todo.id, index)}
                className={styles.textInput}
                ref={(ref) => {
                  inputRefs.current[index] = ref as HTMLInputElement;
                }}
              />
            </div>
          ))}
      </div>
      <InactivityTrigger
        timeout={10000}
        onInactive={() =>
          saveToDatabase({
            todos,
            setTodos,
            dequeue,
            upsertTodo,
            deleteTodo,
            refetch,
          })
        }
      />
    </>
  );
};

export default TodoList;
