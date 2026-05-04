import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { createSolution } from "./create-solution";
import { findManySolutionsChallenger } from "./find-many-solutions-challenger";
import { validateSolution } from "./validated-solution";

export function solutionRoute(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/solution/:challengerId", createSolution);
  app.get("/solution/:challengerId", findManySolutionsChallenger);

  app.patch("/solutions/:id/validate", validateSolution);
}
