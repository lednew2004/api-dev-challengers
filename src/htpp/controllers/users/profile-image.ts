import { v2 as cloudinary } from "cloudinary";
import { FastifyReply, FastifyRequest } from "fastify";
import streamifier from "streamifier";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function ProfileImage(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    // 1️⃣ Pega multipart
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ message: "Imagem obrigatória" });
    }

    console.log("Arquivo recebido:", data.filename);
    console.log("Tipo do arquivo:", data.mimetype);
    console.log("Tamanho do arquivo:", data.file.bytesRead);

    // 2️⃣ Valida tipo de arquivo
    if (!["image/png", "image/jpeg", "image/jpg"].includes(data.mimetype)) {
      return reply
        .status(400)
        .send({ message: "Formato de imagem inválido. Use PNG ou JPEG." });
    }

    // 3️⃣ Pega campos do formulário

    // 4️⃣ Converte stream em Buffer usando Node nativo
    const fileBuffer = await data.toBuffer();

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });

    console.log("Upload Cloudinary concluído:", result.secure_url);

    const user = await prisma.user.update({
      where: {
        id: request.user.sub,
      },
      data: {
        urlImage: result.secure_url,
      },
      omit: {
        password_hash: true,
      },
    });

    // 7️⃣ Retorna sucesso
    return reply.status(201).send({ user });
  } catch (err: any) {
    console.error("Erro ao adicionar imagem:", err);

    // Erro de validação Zod
    if (err instanceof z.ZodError) {
      return reply
        .status(400)
        .send({ message: "Validation error", issues: err.format() });
    }

    return reply.status(500).send({ message: "Erro ao adicionar imagem" });
  }
}
