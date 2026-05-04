import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function createSolution(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createChallengerBodySchema = z.object({
    author: z.string(),
    codeUrl: z.string(),
  });

  const createChallengerParamsSchema = z.object({
    challengerId: z.string(),
  });

  const { author, codeUrl } = createChallengerBodySchema.parse(request.body);
  const { challengerId } = createChallengerParamsSchema.parse(request.params);

  try {
    const doesExistingSolutionInChallenger = await prisma.challenger.findUnique(
      {
        where: {
          id: challengerId,
          solutions: {
            some: {
              authorId: request.user.sub,
            },
          },
        },
      },
    );

    if (doesExistingSolutionInChallenger) {
      return reply.status(409).send({ message: "Solution already exist" });
    }

    const challengerExistingSolutionMe = await prisma.challenger.findUnique({
      where: {
        id: challengerId,
        authorId: request.user.sub,
      },
    });

    if (challengerExistingSolutionMe) {
      return reply.status(409).send({
        message: "don't possible create solution in your challenger ",
      });
    }

    const solution = await prisma.solution.create({
      data: {
        author,
        codeUrl,
        authorId: request.user.sub,
        challengerId,
      },
      include: {
        user: {
          omit: {
            id: true,
            name: true,
            password_hash: true,
          },
        },
      },
    });

    return reply.status(201).send({ solution });
  } catch (err) {
    return reply.status(500).send({ message: err });
  }
}
