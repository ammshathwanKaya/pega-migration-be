export const pegaAnalysisSchema = {
  name: "pega_migration_data",
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
          "summary",
          "complexityScore",
          "agentBlueprints",
          "pegaRules",
          "fileAnalysis",
          "businessRequirements",
          "externalSystems",
          "risks",
          "workflowSteps",
          "technicalDetails",
          "dataEntities",
          "featureMapping",
        ],

        properties: {
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
          agentBlueprints: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              additionalProperties: false,
              required: [
                "id",
                "name",
                "tools",
                "inputs",
                "outputs",
                "triggers",
                "agentType",
                "description",
                "humanInLoop",
                "sourceRules",
                "capabilities",
                "dependencies",
                "errorHandling",
                "systemPrompt",
                "recommendations",
                "featureMapping",
              ],
              properties: {
                id: { type: "string", minLength: 3 },
                name: { type: "string", minLength: 3 },
                systemPrompt: {
                  type: "string",
                  minLength: 500,
                },
                description: {
                  type: "string",
                  minLength: 10,
                },
                agentType: {
                  type: "string",
                  enum: [
                    "orchestrator",
                    "processor",
                    "ui-handler",
                    "decision-maker",
                  ],
                },
                humanInLoop: { type: "boolean" },
                tools: {
                  type: "array",
                  minItems: 1,
                  items: { type: "string", minLength: 2 },
                },
                inputs: {
                  type: "array",
                  minItems: 2,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["name", "type", "source"],
                    properties: {
                      name: { type: "string", minLength: 2 },
                      type: { type: "string", minLength: 2 },
                      source: { type: "string", minLength: 2 },
                    },
                  },
                },
                outputs: {
                  type: "array",
                  minItems: 2,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["name", "type", "destination"],
                    properties: {
                      name: { type: "string", minLength: 2 },
                      type: { type: "string", minLength: 2 },
                      destination: { type: "string", minLength: 2 },
                    },
                  },
                },
                triggers: {
                  type: "array",
                  minItems: 1,
                  items: { type: "string", minLength: 3 },
                },
                sourceRules: {
                  type: "array",
                  items: { type: "string", minLength: 2 },
                },
                capabilities: {
                  type: "array",
                  items: { type: "string", minLength: 2 },
                },
                dependencies: {
                  type: "array",
                  items: { type: "string", minLength: 2 },
                },
                errorHandling: {
                  type: "string",
                  minLength: 10,
                },
                recommendations: {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["id", "issue", "recommendation"],
                    properties: {
                      id: { type: "string", minLength: 2 },
                      issue: { type: "string", minLength: 5 },
                      recommendation: { type: "string", minLength: 5 },
                    },
                  },
                },
                featureMapping: {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: [
                      "id",
                      "agentName",
                      "businessRequirement",
                      "mapping",
                    ],
                    properties: {
                      id: { type: "string", minLength: 2 },
                      agentName: { type: "string", minLength: 3 },
                      businessRequirement: { type: "string", minLength: 5 },
                      mapping: { type: "string", minLength: 10 },
                    },
                  },
                },
              },
            },
          },
          pegaRules: {
            type: "array",
            minItems: 4,
            items: {
              type: "object",
              additionalProperties: false,
              required: [
                "id",
                "name",
                "inputs",
                "outputs",
                "purpose",
                "ruleType",
                "className",
                "dataPages",
                "conditions",
                "sourceFile",
                "referencedRules",
              ],
              properties: {
                id: {
                  type: "string",
                  minLength: 3,
                },
                name: {
                  type: "string",
                  minLength: 3,
                },
                inputs: {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "string",
                    minLength: 2,
                  },
                },
                outputs: {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "string",
                    minLength: 2,
                  },
                },
                purpose: {
                  type: "string",
                  minLength: 20,
                },
                ruleType: {
                  type: "string",
                  minLength: 3,
                },
                className: {
                  type: "string",
                  minLength: 3,
                },
                dataPages: {
                  type: "array",
                  items: {
                    type: "string",
                    minLength: 2,
                  },
                },
                conditions: {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "string",
                    minLength: 3,
                  },
                },
                sourceFile: {
                  type: "string",
                  minLength: 3,
                },
                referencedRules: {
                  type: "array",
                  items: {
                    type: "string",
                    minLength: 2,
                  },
                },
              },
            },
          },
          fileAnalysis: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              additionalProperties: false,
              required: [
                "filename",
                "purpose",
                "ruleType",
                "complexity",
                "connections",
                "dataReferences",
                "ruleIds",
              ],
              properties: {
                filename: { type: "string", minLength: 3 },
                purpose: { type: "string", minLength: 30 },
                ruleType: { type: "string", minLength: 3 },
                complexity: {
                  type: "number",
                  minimum: 0,
                  maximum: 100,
                },
                connections: {
                  type: "array",
                  minItems: 1,
                  items: { type: "string", minLength: 2 },
                },
                dataReferences: {
                  type: "array",
                  items: { type: "string", minLength: 2 },
                },
                ruleIds: {
                  type: "array",
                  minItems: 3,
                  items: { type: "string", minLength: 3 },
                },
              },
            },
          },
          businessRequirements: {
            type: "object",
            additionalProperties: false,
            required: [
              "businessRulesAndLogic",
              "complianceRequirements",
              "objectiveAndValue",
              "scopeAndBoundaries",
              "slaPerformance",
              "stakeholdersAndRoles",
            ],
            properties: {
              businessRulesAndLogic: {
                type: "string",
                minLength: 350,
              },
              complianceRequirements: {
                type: "string",
                minLength: 350,
              },
              objectiveAndValue: {
                type: "string",
                minLength: 350,
              },
              scopeAndBoundaries: {
                type: "string",
                minLength: 350,
              },
              slaPerformance: {
                type: "string",
                minLength: 200,
              },
              stakeholdersAndRoles: {
                type: "array",
                minItems: 4,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["role", "description"],
                  properties: {
                    role: {
                      type: "string",
                      minLength: 3,
                    },
                    description: {
                      type: "string",
                      minLength: 150,
                    },
                  },
                },
              },
            },
          },
          externalSystems: {
            type: "array",
            minItems: 3,
            items: {
              type: "object",
              additionalProperties: false,
              required: [
                "id",
                "name",
                "type",
                "purpose",
                "endpoints",
                "authenticationType",
                "dataExchanged",
              ],
              properties: {
                id: {
                  type: "string",
                  minLength: 3,
                },
                name: {
                  type: "string",
                  minLength: 3,
                },
                type: {
                  type: "string",
                  minLength: 3,
                },
                purpose: {
                  type: "string",
                  minLength: 100,
                },
                endpoints: {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "string",
                    minLength: 5,
                  },
                },
                authenticationType: {
                  type: "string",
                  minLength: 3,
                },
                dataExchanged: {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "string",
                    minLength: 3,
                  },
                },
              },
            },
          },
          risks: {
            type: "array",
            minItems: 2,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["severity", "description"],
              properties: {
                severity: {
                  type: "string",
                  enum: ["low", "medium", "high"],
                },
                description: {
                  type: "string",
                  minLength: 150,
                },
              },
            },
          },
          workflowSteps: {
            type: "array",
            minItems: 4,
            items: {
              type: "object",
              additionalProperties: false,
              required: [
                "step",
                "agentId",
                "details",
                "sourceFileIds",
                "sourceRuleIds",
                "description",
                "connectedSteps",
              ],
              properties: {
                step: {
                  type: "number",
                  minimum: 1,
                },
                agentId: {
                  type: "string",
                  minLength: 3,
                },
                details: {
                  type: "string",
                  minLength: 150,
                },
                sourceFileIds: {
                  type: "string",
                  minLength: 3,
                },
                sourceRuleIds: {
                  type: "string",
                  minLength: 3,
                },
                description: {
                  type: "string",
                  minLength: 200,
                },
                connectedSteps: {
                  type: "array",
                  items: {
                    type: "number",
                    minimum: 1,
                  },
                },
              },
            },
          },
          technicalDetails: {
            type: "object",
            additionalProperties: false,
            required: ["dataModelMappings", "orchestrationFlow"],
            properties: {
              dataModelMappings: {
                type: "object",
                additionalProperties: false,
                required: ["inputOutputData", "keyFields", "transformations"],
                properties: {
                  inputOutputData: {
                    type: "string",
                    minLength: 200,
                  },

                  keyFields: {
                    type: "string",
                    minLength: 200,
                  },

                  transformations: {
                    type: "string",
                    minLength: 200,
                  },
                },
              },

              orchestrationFlow: {
                type: "object",
                additionalProperties: false,
                required: [
                  "decisionBranching",
                  "humanAgentHandoff",
                  "orderOfExecution",
                ],
                properties: {
                  decisionBranching: {
                    type: "string",
                    minLength: 200,
                  },

                  humanAgentHandoff: {
                    type: "string",
                    minLength: 200,
                  },

                  orderOfExecution: {
                    type: "string",
                    minLength: 200,
                  },
                },
              },
            },
          },
          dataEntities: {
            type: "array",
            minItems: 4,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["id", "fields", "description"],
              properties: {
                id: {
                  type: "string",
                  minLength: 3,
                },

                fields: {
                  type: "array",
                  minItems: 2,
                  items: {
                    type: "string",
                    minLength: 2,
                  },
                },

                description: {
                  type: "string",
                  minLength: 20,
                },
              },
            },
          },
          featureMapping: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["id", "agentName", "businessRequirement", "mapping"],
              properties: {
                id: {
                  type: "string",
                  minLength: 5,
                },

                agentName: {
                  type: "string",
                  minLength: 3,
                },

                businessRequirement: {
                  type: "string",
                  minLength: 150,
                },

                mapping: {
                  type: "string",
                  minLength: 50,
                },
              },
            },
          },
        },
      },
    },
  },
};
