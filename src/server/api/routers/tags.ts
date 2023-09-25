import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tagsRouter = createTRPCRouter({
  getTags: protectedProcedure
    .input(
      z.object({
        notesId: z.string().optional(),
        todosId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.tags.findMany({
        where: {
          OR: [{ noteId: input.notesId }, { todosId: input.todosId }],
        },
      });
    }),

  addTag: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        noteId: z.string(),
        todosId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tags.create({
        data: {
          name: input.name,
          noteId: input.noteId,
          todosId: input.todosId,
          userId: ctx.session.user.id,
        },
      });
    }),

  deleteTag: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tags.delete({
        where: { id: input.id },
      });
    }),
});
