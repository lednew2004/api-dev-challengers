import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import { v2 as cloudinary } from "cloudinary";
import fastify from "fastify";
import { env } from "./env.js";
import { challengerRoute } from "./htpp/controllers/challenger/@routes.js";
import { solutionRoute } from "./htpp/controllers/solution/@routes.js";
import { userRoute } from "./htpp/controllers/users/@routes.js";

const app = fastify();

app.register(fastifyCors, {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH"],
});

app.register(fastifyCookie);

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

cloudinary.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.API_KEY,
  api_secret: env.API_SECRET,
});

app.register(userRoute);
app.register(challengerRoute);
app.register(solutionRoute);

app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => console.log("HTTP Server Running"));
