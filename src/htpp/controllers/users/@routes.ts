import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { addSocialLinks } from "./add-social-links";
import { authenticate } from "./authenticate";
import { editProfile } from "./edit-profile";
import { findByUserId } from "./find-by-user-id";
import { userProfile } from "./get-user-profile";
import { ProfileImage } from "./profile-image";
import { refresh } from "./refresh";
import { register } from "./register";

export function userRoute(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/session", authenticate);

  app.get("/me", { onRequest: [verifyJWT] }, userProfile);
  app.get("/user/:id", findByUserId);

  app.patch("/token/refresh", refresh);
  app.patch("/user/image/profile", { onRequest: [verifyJWT] }, ProfileImage);

  app.put("/links", { onRequest: [verifyJWT] }, addSocialLinks);
  app.put("/me", { onRequest: [verifyJWT] }, editProfile);
}
