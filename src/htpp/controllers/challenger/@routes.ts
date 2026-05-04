import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { createChallenger } from "./create-challenger";
import { findChallengerId } from "./find-challenger-id";
import { findManyChallengers } from "./find-many-challengers";
import { searchChallenger } from "./search-challenger";

export function challengerRoute(app: FastifyInstance) {
  app.get("/search/challenger/title", searchChallenger);
  app.get("/challengers", findManyChallengers);
  app.get("/challenger/:id", findChallengerId);

  app.post("/challenger/create", { onRequest: [verifyJWT] }, createChallenger);
}
