import { hash } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  });

  const { email, name, password } = registerBodySchema.parse(request.body);

  try {
    const alreadyExistEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    const password_hash = await hash(password, 6);

    if (alreadyExistEmail) {
      return reply.status(409).send({ message: "Already exist email" });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
      omit: {
        password_hash: true,
      },
    });

    return reply.status(201).send({ user });
  } catch (err) {
    return reply.status(500).send({ message: err });
  }
}
