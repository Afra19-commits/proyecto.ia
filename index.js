import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("✅ IA activa con OpenRouter");

// ✅ Endpoint del chatbot con IA REAL
app.post("/chat", async (req, res) => {
  try {
    const { mensaje } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          messages: [
            {
              role: "system",
              content:
                "Sos un asistente experto en fitness, gimnasio y suplementos. Recomendás rutinas, hábitos saludables y productos como proteína o creatina según el objetivo del usuario.",
            },
            {
              role: "user",
              content: mensaje,
            },
          ],
        }),
      },
    );

    const data = await response.json();

    let respuesta = "⚠️ No hubo respuesta";

    if (data.choices && data.choices.length > 0) {
      respuesta = data.choices[0]?.message?.content || respuesta;
    }

    res.json({ respuesta });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ error: "Error en la IA" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
