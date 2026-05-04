import { FastifyReply, FastifyRequest } from "fastify";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    const decoded = await request.jwtVerify<{ sub: string }>({
      onlyCookie: true,
    });

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: decoded.sub,
        },
      },
    );

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: decoded.sub,
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
  } catch {
    return reply.status(401).send({ message: "Refresh inválido" });
  }
}
