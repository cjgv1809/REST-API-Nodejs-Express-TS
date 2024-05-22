import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    tags: [
      {
        name: "Products",
        description: "Products related endpoints",
      },
    ],
    info: {
      title: "REST API Node.js / Express / TypeScript",
      version: "1.0.0",
      description: "API Documentation",
    },
  },
  apis: ["./src/routes.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

// custom options for the swagger UI
const swaggerUiOptions: SwaggerUiOptions = {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "API Documentation",
};

export { swaggerUiOptions };

export default swaggerSpec;
