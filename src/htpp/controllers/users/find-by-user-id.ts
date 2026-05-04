import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function findByUserId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findByUserIdParamsSchema = z.object({
    id: z.string(),
  });

  const { id } = findByUserIdParamsSchema.parse(request.params);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      omit: {
        password_hash: true,
      },
      include: {
        challengers: {
          omit: {
            authorId: true,
          },
        },
        socialLinks: {
          omit: {
            userId: true,
          },
        },
        solutions: true,
      },
    });

    if (!user) {
      return reply.status(404).send({ message: "Resource not found" });
    }

    return reply.status(200).send({ user });
  } catch (err) {
    return reply.status(500).send({ message: err });
  }
}
