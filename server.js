import express from "express";
import { v2 as cloudinary } from "cloudinary";

const app = express();
app.use(express.json({ limit: "10mb" }));

// Configuração do Cloudinary (vai usar variáveis de ambiente)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Rota principal (só pra testar se tá funcionando)
app.get("/", (req, res) => {
  res.json({ status: "online", message: "Servidor funcionando!" });
});

// Rota que transforma URL do Notion em URL permanente
app.post("/upload-image", async (req, res) => {
  const { url, folder } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: "URL é obrigatória" });
  }

  try {
    // Cloudinary baixa a imagem da URL e faz upload automático
    const result = await cloudinary.uploader.upload(url, {
      folder: folder || "notion-library",
      resource_type: "image"
    });

    // Retorna a URL permanente
    res.json({
      success: true,
      permanent_url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ 
      success: false, 
      error: "Erro ao processar imagem",
      details: error.message 
    });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
