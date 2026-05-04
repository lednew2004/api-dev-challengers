import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";

export async function userProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: request.user.sub,
      },
      include: {
        socialLinks: true,
        challengers: {
          include: {
            requirements: true,
            solutions: true,
            techsSuggesteds: true,
          },
        },
        solutions: {
          include: {
            challenger: true,
          },
        },
      },
      omit: {
        password_hash: true,
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
