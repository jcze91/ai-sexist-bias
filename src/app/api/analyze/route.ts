import { biasAnalyzeSchema, inputSchema } from "@/models/schema";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed." }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Lecture et validation des données d'entrée
    const body = await req.json();
    const { context, content } = inputSchema.parse(body);

    // Générer une liste des biais avec OpenAI et AI SDK
    const result = streamObject({
      model: openai("gpt-4-turbo"),
      schema: biasAnalyzeSchema,
      messages: [
        {
          role: "system",
          content: `
          Expert en analyse de biais sexistes linguistiques genrés.
    
RÈGLES :
- Répondre dans la langue du texte source
- Ne PAS signaler les tournures genrées neutres/positives
- Ne PAS marquer de biais sans suggestion d'amélioration
- Suggérer uniquement des reformulations naturelles et contextuelles

NIVEAUX D'ANALYSE :
- HIGH: Tous biais explicites et implicites 
- MEDIUM: Biais explicites et modérés
- LOW: Uniquement biais explicites graves

FORMAT DES SUGGESTIONS :
- Court et direct
- Préserver le ton et l'intention du message original 
- S'adapter au contexte (marketing, RH, etc.)

POINTS DE VIGILANCE :
- Stéréotypes de rôle/comportement
- Langage exclusif
- Présupposés genrés
- Asymétries linguistiques
          `,
        },
        {
          role: "user",
          content: `
          Context: "${context}"
          Text to analyze: "${content}"
          `,
        },
      ],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    // Gestion des erreurs de validation avec Zod
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ success: false, error: error.errors }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Gestion des autres erreurs
    console.error(
      "Erreur API OpenAI:",
      typeof error === "object" && "message" in error! ? error!.message : ""
    );
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
