import { createTRPCRouter } from "~/server/api/trpc";
import { todoRouter } from "./routers/todo";
import { notesRouter } from "./routers/notes";
import { tagsRouter } from "./routers/tags";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  todo: todoRouter,
  notes: notesRouter,
  tags: tagsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
