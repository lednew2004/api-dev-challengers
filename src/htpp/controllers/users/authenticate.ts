import { compare } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return reply.status(404).send({ message: "Invalid credentials" });
    }

    const doesPasswordHashMatchs = await compare(password, user.password_hash);

    if (!doesPasswordHashMatchs) {
      return reply.status(404).send({ message: "Invalid credentials" });
    }

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    );

    const refreshToken = await reply.jwtSign(
      {},

      {
        sign: {
          sub: user.id,
          expiresIn: "7d",
        },
      },
    );

    return reply
      .status(200)
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: false,
        sameSite: "lax",
        httpOnly: true,
      })
      .send({ token });
  } catch (err) {
    return reply.status(500).send({ message: err });
  }
}
