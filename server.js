{\rtf1\ansi\ansicpg1252\cocoartf2868
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import express from "express";\
import \{ v2 as cloudinary \} from "cloudinary";\
\
const app = express();\
app.use(express.json(\{ limit: "10mb" \}));\
\
// Configura\'e7\'e3o do Cloudinary (vai usar vari\'e1veis de ambiente)\
cloudinary.config(\{\
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,\
  api_key: process.env.CLOUDINARY_API_KEY,\
  api_secret: process.env.CLOUDINARY_API_SECRET\
\});\
\
// Rota principal (s\'f3 pra testar se t\'e1 funcionando)\
app.get("/", (req, res) => \{\
  res.json(\{ status: "online", message: "Servidor funcionando!" \});\
\});\
\
// Rota que transforma URL do Notion em URL permanente\
app.post("/upload-image", async (req, res) => \{\
  const \{ url, folder \} = req.body;\
  \
  if (!url) \{\
    return res.status(400).json(\{ error: "URL \'e9 obrigat\'f3ria" \});\
  \}\
\
  try \{\
    // Cloudinary baixa a imagem da URL e faz upload autom\'e1tico\
    const result = await cloudinary.uploader.upload(url, \{\
      folder: folder || "notion-library",\
      resource_type: "image"\
    \});\
\
    // Retorna a URL permanente\
    res.json(\{\
      success: true,\
      permanent_url: result.secure_url,\
      public_id: result.public_id\
    \});\
  \} catch (error) \{\
    console.error("Erro:", error);\
    res.status(500).json(\{ \
      success: false, \
      error: "Erro ao processar imagem",\
      details: error.message \
    \});\
  \}\
\});\
\
// Inicia o servidor\
const PORT = process.env.PORT || 3000;\
app.listen(PORT, () => \{\
  console.log(`Servidor rodando na porta $\{PORT\}`);\
\});}