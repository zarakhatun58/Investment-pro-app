const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Investment Platform API",
    version: "1.0.0",
    description: "MERN Investment & Referral Platform"
  },

  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Development Server",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    schemas: {
      RegisterRequest: {
        type: "object",
        required: [
          "fullName",
          "email",
          "mobile",
          "password",
        ],
        properties: {
          fullName: {
            type: "string",
            example: "John Doe",
          },
          email: {
            type: "string",
            example: "john@gmail.com",
          },
          mobile: {
            type: "string",
            example: "9876543210",
          },
          password: {
            type: "string",
            example: "123456",
          },
          referralCode: {
            type: "string",
            example: "ABC123",
          },
        },
      },

      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            example: "john@gmail.com",
          },
          password: {
            type: "string",
            example: "123456",
          },
        },
      },

      InvestmentRequest: {
        type: "object",
        required: [
          "amount",
          "planName",
          "dailyROI",
          "durationDays",
        ],
        properties: {
          amount: {
            type: "number",
            example: 1000,
          },
          planName: {
            type: "string",
            example: "Starter Plan",
          },
          dailyROI: {
            type: "number",
            example: 2,
          },
          durationDays: {
            type: "number",
            example: 30,
          },
        },
      },
    },
  },

  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register User",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref:
                  "#/components/schemas/RegisterRequest",
              },
            },
          },
        },

        responses: {
          201: {
            description:
              "User registered successfully",
          },
          400: {
            description:
              "User already exists",
          },
        },
      },
    },

    "/api/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login User",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref:
                  "#/components/schemas/LoginRequest",
              },
            },
          },
        },

        responses: {
          200: {
            description:
              "Login successful",
          },
          401: {
            description:
              "Invalid credentials",
          },
        },
      },
    },

    "/api/investments": {
      post: {
        tags: ["Investments"],
        summary:
          "Create Investment",

        security: [
          {
            bearerAuth: [],
          },
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref:
                  "#/components/schemas/InvestmentRequest",
              },
            },
          },
        },

        responses: {
          201: {
            description:
              "Investment created",
          },
        },
      },

      get: {
        tags: ["Investments"],
        summary:
          "Get User Investments",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          200: {
            description:
              "Investment List",
          },
        },
      },
    },

    "/api/dashboard": {
      get: {
        tags: ["Dashboard"],
        summary:
          "Get Dashboard Data",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          200: {
            description:
              "Dashboard Information",
          },
        },
      },
    },

    "/api/referrals/direct": {
      get: {
        tags: ["Referrals"],
        summary:
          "Get Direct Referrals",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          200: {
            description:
              "Direct Referral List",
          },
        },
      },
    },

    "/api/referrals/tree": {
      get: {
        tags: ["Referrals"],
        summary:
          "Get Referral Tree",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          200: {
            description:
              "Referral Hierarchy",
          },
        },
      },
    },

    "/api/roi-history": {
      get: {
        tags: ["ROI"],
        summary:
          "Get ROI History",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          200: {
            description:
              "ROI History",
          },
        },
      },
    },

    "/api/referral-income": {
      get: {
        tags: ["Referral Income"],
        summary:
          "Get Referral Income History",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          200: {
            description:
              "Referral Income History",
          },
        },
      },
    },

    "/api/transactions": {
      get: {
        tags: ["Transactions"],
        summary:
          "Get Wallet Transactions",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          200: {
            description:
              "Transaction History",
          },
        },
      },
    },
  },
};

export default swaggerDocument;