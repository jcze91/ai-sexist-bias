import { z } from "zod";

export const sensitivitySchema = z.enum(["high", "medium", "low"]);

export const inputSchema = z.object({
  context: z
    .string()
    .min(1, { message: "Context is required" })
    .max(100, { message: "Context must be less than 100 characters" }),
  content: z.string().min(1, { message: "Content is required" }),
  sensitivity: sensitivitySchema,
});

export const biasItemSchema = z.object({
  severity: z
    .enum(["low", "medium", "high"])
    .describe("Severity level of the identified bias."),
  passage: z
    .string()
    .describe(
      "The specific passage from the input text that contains a potential bias."
    ),
  type: z
    .string()
    .describe(
      "The category of the identified bias, returned in the same language as the input text. Examples include 'Gender Stereotype', 'Gender Exclusion', etc., but this list is not exhaustive, set your own type in the same language than inputs."
    ),
  explanation: z
    .string()
    .describe(
      "A detailed explanation of why the identified passage is problematic, returned in the same language as the input text."
    ),
  suggestion: z
    .string()
    .describe(
      "A practical reformulation of the problematic passage. The suggestion must correct the bias while maintaining the intended meaning of the original text and be returned in the same language as the input text."
    ),
  // location: z
  //   .object({
  //     start: z
  //       .number()
  //       .describe("Start index of the problematic passage in the input text."),
  //     end: z
  //       .number()
  //       .describe("End index of the problematic passage in the input text."),
  //   })
  //   .describe("Location of the problematic passage in the input text."),
});

export const biasListSchema = z
  .array(biasItemSchema)
  .describe(
    "An array containing all identified sexist biases from the analyzed text. Each object represents one problematic passage and its associated details."
  );

export const biasAnalyzeSchema = z
  .object({
    result: biasListSchema,
    corrected_text: z
      .string()
      .describe(
        "The original text with all suggested corrections applied. If no biases are detected, it should match the input text."
      ),
    potential_impact: z
      .string()
      .describe(
        "Potential consequences of not addressing the detected biases."
      ),
    references: z
      .array(
        z.object({
          title: z.string().describe("Title of the reference material."),
          url: z.string().url().describe("URL of the reference material."),
        })
      )
      .describe(
        "References or resources related to the detected biases. That should be existing links"
      ),
  })
  .describe(
    "The complete analysis result, containing a list of identified sexist biases in the input text. Each bias is detailed with its passage, type, explanation, and suggested reformulation."
  );
