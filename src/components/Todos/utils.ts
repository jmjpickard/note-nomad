import { Todos } from "@prisma/client";
import { api } from "~/utils/api";

interface TodoWithAction extends Todos {
  index: number;
  action: "upsert" | "delete";
}

interface SaveToDatabaseProps {
  todos: Todos[];
  setTodos: React.Dispatch<React.SetStateAction<Todos[]>>;
  dequeue: () => TodoWithAction | undefined;
  upsertTodo: ReturnType<typeof api.todo.upsertTodo.useMutation>;
  deleteTodo: ReturnType<typeof api.todo.deleteTodo.useMutation>;
  refetch: () => void;
}

export const saveToDatabase = ({
  todos,
  setTodos,
  dequeue,
  upsertTodo,
  deleteTodo,
  refetch,
}: SaveToDatabaseProps) => {
  while (true) {
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
            order: todo.order,
          });

          const newTodos = todos.map((existingTodo) =>
            existingTodo.id === updatedTodo.id ? updatedTodo : existingTodo
          );
          setTodos(newTodos);
          refetch();
        } catch (err) {
          console.log(err);
        }
      };

      const handleDelete = async () => {
        try {
          await deleteTodo.mutateAsync({
            id: todo.id,
          });
          refetch();
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
    } else {
      break; // Break the loop if the queue is empty
    }
  }
};
