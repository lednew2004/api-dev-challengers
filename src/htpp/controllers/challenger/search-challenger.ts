import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function searchChallenger(request: FastifyRequest, reply: FastifyReply) {
    const createChallengerBodySchema = z.object({
        title: z.string(),
        page: z.coerce.number(),
    });


    const { title, page } = createChallengerBodySchema.parse(request.query);

    try {
        const challenger = await prisma.challenger.findMany({
            where: {
               title: {contains: title}
           },
            take: 20,
            skip: (page - 1) * 20,
        });

        return reply.status(200).send({ challenger });
    } catch (err) {
        return reply.status(500).send({ message: err });
    };
};