import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("✅ IA activa (OpenRouter)");

app.post("/chat", async (req, res) => {
  try {
    const { mensaje } = req.body;
    
  if (mensaje.toLowerCase().includes("proteina")) {
    return res.json({
    respuesta: "Te recomiendo proteína whey y creatina. Podés comprarlas en la sección de ecommerce del gimnasio."
    });
  }
  
  if (mensaje.toLowerCase().includes("masa muscular")) {
    return res.json({
    respuesta: "Para ganar masa muscular te recomiendo musculación 3-4 veces por semana y complementar con proteína y creatina."
    });
  }

  if (mensaje.toLowerCase().includes("bajar de peso")) {
    return res.json({
     respuesta: "Para bajar de peso podés combinar cardio, funcional y cuidar la alimentación."
   });
  }

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
    content: `Sos un asistente inteligente de un gimnasio.

    Tu objetivo es ayudar a los usuarios a:
    - Elegir actividades (crossfit, yoga, musculación, cardio)
    - Recomendar horarios de entrenamiento
    - Sugerir productos del ecommerce (proteína, creatina, accesorios)
    - Dar consejos personalizados según objetivos

    Respondé de forma clara, breve y útil, como un entrenador profesional.`
    }

,
            {
              role: "user",
              content: mensaje,
            },
          ],
        }),
      },
    );

    const data = await response.json();
    console.log("DATA COMPLETA:", JSON.stringify(data, null, 2));

    console.log("🔎 respuesta:", data);

    let respuestaIA = "⚠️ No hubo respuesta";

    // Distintos formatos posibles de respuesta
    if (data.choices && data.choices.length > 0) {
      if (data.choices[0].message && data.choices[0].message.content) {
        respuestaIA = data.choices[0].message.content;
      } else if (data.choices[0].text) {
        respuestaIA = data.choices[0].text;
      }
    }
   
    res.json({
    respuesta: respuestaIA,
    fuente: "IA OpenRouter",
    fecha: new Date()
  });

  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
``;
