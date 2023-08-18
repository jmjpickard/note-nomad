import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getTodosByUserIdAndDate: protectedProcedure
    .input(
      z.object({
        date: z.date(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.todos.findMany({
        where: {
          userId: ctx.session.user.id,
          date: {
            gte: input.date,
            lt: new Date(input.date.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });
    }),
  upsertTodo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.date(),
        title: z.string(),
        content: z.string(),
        done: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, date, title, content, done } = input;
      return await ctx.prisma.todos.upsert({
        where: {
          id,
        },
        update: {
          userId: ctx.session.user.id,
          title,
          content,
          done,
          updatedAt: new Date(),
        },
        create: {
          userId: ctx.session.user.id,
          title,
          content,
          done,
          date,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }),
  deleteTodo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      return await ctx.prisma.todos.delete({
        where: {
          id,
        },
      });
    }),
});
