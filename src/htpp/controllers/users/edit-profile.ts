import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function editProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const schema = z.object({
    name: z.string().optional(),
    biography: z.string().optional(),
  });

  const { name, biography } = schema.parse(request.body);

  const user = await prisma.user.update({
    where: {
      id: request.user.sub,
    },
    data: {
      name,
      biography,
    },
    include: {
      challengers: true,
      socialLinks: true,
      solutions: true,
    },
  });

  return reply.send({ user });
}
