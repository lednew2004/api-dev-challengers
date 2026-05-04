import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function findManyChallengers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const schema = z.object({
    page: z.coerce.number().default(1),
  });

  const { page } = schema.parse(request.query);

  // 🔓 tenta pegar usuário, mas não obriga
  await request.jwtVerify().catch(() => null);

  const userId = request.user?.sub;

  try {
    const challengers = await prisma.challenger.findMany({
      where: userId
        ? {
            authorId: {
              not: userId,
            },
            solutions: {
              none: {
                authorId: userId,
                validated_at: {
                  not: null,
                },
              },
            },
          }
        : {},

      take: 20,
      skip: (page - 1) * 20,

      include: {
        requirements: {
          select: { id: true, title: true },
        },
        techsSuggesteds: {
          select: { id: true, title: true },
        },
        solutions: {
          select: {
            authorId: true,
            id: true,
            author: true,
            codeUrl: true,
            validated_at: true,
          },
        },
      },
    });

    return reply.send({ challengers });
  } catch (err) {
    return reply.status(500).send({ message: err });
  }
}
