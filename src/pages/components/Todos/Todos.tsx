import React from "react";
import styles from "./todos.module.css";
import { Todos } from "@prisma/client";
import cuid from "cuid";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import InactivityTrigger from "../InactivityTrigger/InactivityTrigger";

interface TodoListProps {
  selectedDate: Date;
  data?: Todos[];
  loading: boolean;
}

interface TodoWithAction extends Todos {
  index: number;
  action: "upsert" | "delete";
}

class PriorityQueue<T extends { index: number; id: string }> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  enqueue(element: T): void {
    if (this.items.some((item) => item.id === element.id)) {
      this.items = this.items.map((item) =>
        item.id === element.id ? element : item
      );
      return;
    }
    if (this.isEmpty()) {
      this.items.push(element);
    } else {
      let added = false;
      for (let i = 0; i < this.items.length; i++) {
        if (element.index < this.items[i]!.index) {
          this.items.splice(i, 0, element);
          added = true;
          break;
        }
      }
      if (!added) {
        this.items.push(element);
      }
    }
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  length(): number {
    return this.items.length;
  }
}

const priorityQueue = new PriorityQueue<TodoWithAction>();

const TodoList: React.FC<TodoListProps> = ({
  selectedDate,
  data,
  loading,
}: TodoListProps) => {
  const session = useSession();

  const [todos, setTodos] = React.useState<Todos[]>(
    data ?? [
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
    ]
  );
  React.useEffect(() => {
    if (data && data.length > 0) {
      setTodos(data);
    }
  }, [data]);

  const upsertTodo = api.todo.upsertTodo.useMutation();

  const inputRefs = React.useRef<HTMLInputElement[]>([]);

  const handleCheckboxChange = async (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      const updatedTodo = { ...todo, done: !todo.done };
      setTodos((todos) => {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        );
        return updatedTodos;
      });
      priorityQueue.enqueue({
        action: "upsert",
        ...updatedTodo,
        index: priorityQueue.length() + 1,
      });
    }
  };

  const onInactive = async () => {
    while (priorityQueue.length() > 0) {
      const todo = priorityQueue.dequeue();
      if (todo) {
        if (todo.action === "upsert") {
          await upsertTodo.mutateAsync({
            id: todo.id,
            title: todo.title,
            date: todo.date,
            content: todo.content ?? "",
            done: todo.done,
          });
        }
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
      priorityQueue.enqueue({
        action: "upsert",
        ...updatedTodo,
        index: priorityQueue.length() + 1,
      });
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    index: number
  ) => {
    if (e.key === "Enter") {
      const todo = todos.find((todo) => todo.id === id);
      if (todo) {
        const updatedTodo = { ...todo, content: e.currentTarget.value };
        setTodos((todos) => {
          const updatedTodos = todos.map((todo) =>
            todo.id === id ? updatedTodo : todo
          );
          return updatedTodos;
        });
        priorityQueue.enqueue({
          action: "upsert",
          ...updatedTodo,
          index: priorityQueue.length() + 1,
        });
        if (index === todos.length - 1) {
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
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  return (
    <div className={styles.todoList}>
      <InactivityTrigger
        timeout={2000}
        onInactive={async () => await onInactive()}
      />
      {loading && <div>Loading...</div>}
      {todos.map((todo, index) => (
        <div className={styles.todoItem} key={todo.id}>
          <div className={styles.checkContainer}>
            <input type="checkbox" checked={todo.done} onChange={() => {}} />
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
