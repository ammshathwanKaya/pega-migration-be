export const simpleAnalysisSchema = {
  name: "simple_analysis",
  schema: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Main response message",
      },
      intent: {
        type: "string",
        description: "Detected intent of the input",
      },
    },
    required: ["message", "intent"],
    additionalProperties: false,
  },
};
