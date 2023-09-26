import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tagsRouter = createTRPCRouter({
  getTags: protectedProcedure
    .input(
      z.object({
        date: z.date(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.tags.findMany({
        where: {
          date: input.date,
          userId: ctx.session.user.id,
        },
      });
    }),

  addTag: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        date: z.date(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tags.create({
        data: {
          name: input.name,
          date: input.date,
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
