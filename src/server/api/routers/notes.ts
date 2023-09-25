import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const notesRouter = createTRPCRouter({
  getNoteByDate: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.notes.findFirst({
        where: {
          userId: ctx.session.user.id,
          date: input.date,
        },
      });
    }),

  upsertNote: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string(),
        date: z.date(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.notes.upsert({
        where: { id: input.id },
        create: {
          date: input.date,
          content: input.content,
          userId: ctx.session.user.id,
        },
        update: {
          content: input.content,
        },
      });
    }),
});
