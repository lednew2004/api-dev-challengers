import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function findChallengerId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const schema = z.object({
    id: z.string(),
  });

  const { id } = schema.parse(request.params);

  const userId = request.user?.sub;

  try {
    const challenger = await prisma.challenger.findUnique({
      where: { id },
      include: {
        requirements: {
          select: { id: true, title: true },
        },
        solutions: {
          select: {
            challenger: true,
            id: true,
            author: true,
            authorId: true,
            codeUrl: true,
            validated_at: true,
            user: {
              omit: {
                password_hash: true,
              },
            },
          },
        },
        techsSuggesteds: {
          select: { id: true, title: true },
        },
      },
    });

    if (!challenger) {
      return reply.status(404).send({
        message: "Challenge not found",
      });
    }

    // 🔒 só verifica se estiver logado
    if (userId) {
      const alreadySolved = await prisma.solution.findFirst({
        where: {
          challengerId: id,
          authorId: userId,
          validated_at: {
            not: null,
          },
        },
      });

      if (alreadySolved) {
        return reply.status(403).send({
          message: "You already solved this challenge",
        });
      }
    }

    return reply.send({ challenger });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ message: "Internal error" });
  }
}
