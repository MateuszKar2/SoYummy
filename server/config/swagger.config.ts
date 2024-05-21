// swagger.config.ts
export const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "SoYummy API",
      description: "SoYummi API Information",
      version: "1.0.0",
      servers: ["http://localhost:3000"],
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.ts"],
};