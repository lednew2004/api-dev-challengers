import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { Level } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";

export async function createChallenger(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createChallengerBodySchema = z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    level: z.enum(Level),
    requirements: z.array(z.string()),
    technologies: z.array(z.string()),
  });

  const { author, description, title, level, requirements, technologies } =
    createChallengerBodySchema.parse(request.body);

  try {
    const challenger = await prisma.challenger.create({
      data: {
        author,
        description,
        title,
        level,
        authorId: request.user.sub,
        requirements: {
          create: requirements.map((req) => ({
            title: req,
          })),
        },
        techsSuggesteds: {
          create: technologies.map((tech) => ({
            title: tech,
          })),
        },
      },
      include: {
        user: {
          select: {
            email: true,
            created_at: true,
          },
        },
        requirements: true,
        techsSuggesteds: true,
      },
    });

    return reply.status(201).send({ challenger });
  } catch (err) {
    return reply.status(500).send({ message: "erro" });
  }
}
