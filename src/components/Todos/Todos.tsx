import React from "react";
import styles from "./todos.module.css";
import { Todos } from "@prisma/client";
import cuid from "cuid";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import InactivityTrigger from "../InactivityTrigger/InactivityTrigger";
import { usePriorityQueue } from "../QueueContext/PriorityQueueContext";

interface TodoListProps {
  selectedDate: Date;
  data?: Todos[];
  loading: boolean;
}

interface TodoWithAction extends Todos {
  index: number;
  action: "upsert" | "delete";
}

const TodoList: React.FC<TodoListProps> = ({
  selectedDate,
  data,
  loading,
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

  const onInactive = () => {
    if (length === 0) {
      return;
    }

    const todo = dequeue();

    if (todo) {
      const handleUpsert = async () => {
        try {
          const updatedTodo = await upsertTodo.mutateAsync({
            id: todo.id,
            title: todo.title,
            date: todo.date,
            content: todo.content ?? "",
            done: todo.done,
          });

          const newTodos = todos.map((existingTodo) =>
            existingTodo.id === updatedTodo.id ? updatedTodo : existingTodo
          );
          setTodos(newTodos);
        } catch (err) {
          console.log(err);
        }
      };

      const handleDelete = async () => {
        try {
          await deleteTodo.mutateAsync({
            id: todo.id,
          });
        } catch (err) {
          console.log(err);
        }
      };

      switch (todo.action) {
        case "upsert":
          void handleUpsert();
          break;
        case "delete":
          void handleDelete();
          break;
      }
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
    if (e.key === "Enter") {
      e.preventDefault();
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
        if (index === todos.length - 1) {
          setFocusIndex(index + 1);
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
            },
          ]);
        }
      }
    }
    if (e.key === "Backspace") {
      if (e.currentTarget.value.length === 0) {
        setTodos(todos.filter((t) => t.id !== id));
        setFocusIndex(index - 1);
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
  };

  return (
    <div className={styles.todoList}>
      <InactivityTrigger timeout={500} onInactive={() => onInactive()} />
      {loading && <div>Loading...</div>}
      {todos.map((todo, index) => (
        <div className={styles.todoItem} key={todo.id}>
          <div className={styles.checkContainer}>
            <input type="checkbox" checked={todo.done} onChange={() => null} />
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
  );
};

export default TodoList;
