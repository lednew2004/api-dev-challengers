import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function addSocialLinks(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const schema = z.object({
    title: z.string(),
    url: z.string(),
  });

  const { title, url } = schema.parse(request.body);

  const user = await prisma.user.update({
    where: {
      id: request.user.sub,
    },
    data: {
      socialLinks: {
        create: {
          title,
          url,
        },
      },
    },
    omit: {
      password_hash: true,
    },
    include: {
      socialLinks: true,
    },
  });

  return reply.send({ user });
}
