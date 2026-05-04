import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function findManySolutionsChallenger(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findManySolutionsChallengerparamsSchema = z.object({
    challengerId: z.string(),
  });

  const findManySolutionsChallengerQuerySchema = z.object({
    page: z.coerce.number(),
  });

  const { challengerId } = findManySolutionsChallengerparamsSchema.parse(
    request.params,
  );
  const { page } = findManySolutionsChallengerQuerySchema.parse(request.query);

  try {
    const solutions = await prisma.solution.findMany({
      where: {
        challengerId,
      },
      include: {
        challenger: true,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return reply.status(200).send({ solutions });
  } catch (err) {
    return reply.status(500).send({ message: err });
  }
}
