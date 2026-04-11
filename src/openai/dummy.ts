import OpenAI from "openai";

export const pegaAnalysisSchema = {
  name: "pega_full_response",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["analysis"],

    properties: {
      analysis: {
        type: "object",
        additionalProperties: false,
        required: [
          "id",
          "projectId",
          "status",
          "summary",
          // "workflowSteps",
          // "agenticRequirements",
          // "dataEntities",
          "complexityScore",
          // "risks",
          // "fileAnalysis",
          // "pegaRules",
          "agentBlueprints",
          // "businessRequirements",
          // "externalSystems",
          // "technicalDetails",
          // "rawAnalysis",
          // "errorMessage",
          // "createdAt",
          // "updatedAt",
        ],

        properties: {
          id: { type: "string", format: "uuid" },
          projectId: { type: "string", format: "uuid" },

          status: {
            type: "string",
            enum: ["completed", "failed", "pending"],
          },

          summary: {
            type: "string",
            minLength: 500,
            maxLength: 2000,
          },

          complexityScore: {
            type: "number",
            minimum: 0,
            maximum: 100,
          },

          // dataEntities: {
          //   type: "array",
          //   minItems: 1,
          //   items: {
          //     type: "string",
          //     minLength: 2,
          //   },
          // },

          // workflowSteps: {
          //   type: "array",
          //   minItems: 1,
          //   items: {
          //     type: "object",
          //     required: [
          //       "step",
          //       "agentId",
          //       "details",
          //       "sourceFile",
          //       "sourceRule",
          //       "description",
          //       "connectedSteps",
          //     ],
          //     properties: {
          //       step: { type: "number", minimum: 1 },
          //       agentId: { type: "string", minLength: 3 },
          //       details: { type: "string", minLength: 10 },
          //       sourceFile: { type: "string", minLength: 3 },
          //       sourceRule: { type: "string", minLength: 3 },
          //       description: { type: "string", minLength: 5 },
          //       connectedSteps: {
          //         type: "array",
          //         items: { type: "number" },
          //       },
          //     },
          //   },
          // },

          // risks: {
          //   type: "array",
          //   minItems: 1,
          //   items: {
          //     type: "object",
          //     required: ["severity", "description"],
          //     properties: {
          //       severity: {
          //         type: "string",
          //         enum: ["low", "medium", "high"],
          //       },
          //       description: {
          //         type: "string",
          //         minLength: 10,
          //       },
          //     },
          //   },
          // },

          // businessRequirements: {
          //   type: "object",
          //   required: [
          //     "businessRulesAndLogic",
          //     "complianceRequirements",
          //     "objectiveAndValue",
          //     "scopeAndBoundaries",
          //     "slaPerformance",
          //     "stakeholdersAndRoles",
          //   ],
          //   properties: {
          //     businessRulesAndLogic: { type: "string", minLength: 20 },
          //     complianceRequirements: { type: "string", minLength: 20 },
          //     objectiveAndValue: { type: "string", minLength: 20 },
          //     scopeAndBoundaries: { type: "string", minLength: 20 },
          //     slaPerformance: { type: "string", minLength: 10 },
          //     stakeholdersAndRoles: {
          //       type: "array",
          //       minItems: 1,
          //       items: {
          //         type: "object",
          //         required: ["role", "description"],
          //         properties: {
          //           role: { type: "string", minLength: 3 },
          //           description: { type: "string", minLength: 5 },
          //         },
          //       },
          //     },
          //   },
          // },

          // externalSystems: {
          //   type: "array",
          //   minItems: 1,
          //   items: { type: "object" },
          // },

          // technicalDetails: {
          //   type: "object",
          // },

          // rawAnalysis: {
          //   type: "object",
          // },

          // errorMessage: {
          //   type: ["string", "null"],
          // },

          // createdAt: {
          //   type: "string",
          //   format: "date-time",
          // },

          // updatedAt: {
          //   type: "string",
          //   format: "date-time",
          // },
        },
      },
    },
  },
};
