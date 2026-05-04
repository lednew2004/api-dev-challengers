import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function validateSolution(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string(),
  });

  const { id } = paramsSchema.parse(request.params);

  console.log(id);

  const userId = request.user.sub;

  try {
    // 1. busca solução + desafio
    const solution = await prisma.solution.findUnique({
      where: { id },
      include: {
        challenger: true,
      },
    });

    if (!solution) {
      return reply.status(404).send({
        message: "Solution not found",
      });
    }

    // 2. verifica se é dono do desafio
    if (solution.challenger.authorId !== userId) {
      return reply.status(403).send({
        message: "You are not allowed to validate this solution",
      });
    }

    // 3. evita validar duas vezes
    if (solution.validated_at) {
      return reply.status(400).send({
        message: "Solution already validated",
      });
    }

    // 4. valida
    await prisma.solution.update({
      where: { id },
      data: {
        validated_at: new Date(),
      },
    });

    return reply.send({
      message: "Solution validated successfully",
    });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({
      message: "Internal error",
    });
  }
}
