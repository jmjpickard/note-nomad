import React, { useState } from "react";
import styles from "./todos.module.css";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "", completed: false },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    todoId: number
  ) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, text: e.target.value };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    todoId: number
  ) => {
    if (e.key === "Enter") {
      const newTodoId = todos.length + 1;
      const newTodo: Todo = { id: newTodoId, text: "", completed: false };
      const updatedTodos = todos.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, completed: true };
        }
        return todo;
      });
      setTodos([...updatedTodos, newTodo]);
    }
  };

  const handleCheckboxChange = (todoId: number) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  return (
    <div className={styles.todoList}>
      {todos.map((todo) => (
        <div className={styles.todoItem} key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleCheckboxChange(todo.id)}
            className={styles.checkboxInput}
          />
          <input
            type="text"
            value={todo.text}
            onChange={(e) => handleInputChange(e, todo.id)}
            onKeyDown={(e) => handleKeyPress(e, todo.id)}
            className={styles.textInput}
          />
        </div>
      ))}
    </div>
  );
};

export default TodoList;
