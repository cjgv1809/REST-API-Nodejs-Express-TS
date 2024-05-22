import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateAvailability,
  updateProduct,
} from "./handlers/product";
import { body, param } from "express-validator";
import { handleInputErrors } from "./middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The product ID
 *           example: 1
 *         name:
 *           type: string
 *           description: The product name
 *           example: Monitor Curvo 40 Pulgadas
 *         price:
 *           type: number
 *           description: The product price
 *           example: 399.99
 *         availability:
 *           type: boolean
 *           description: The product availability
 *           example: true
 *       required:
 *         - name
 *         - price
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products from the database
 *     tags:
 *       - Products
 *     description: Retrieve a list of products
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

// Routing
router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     description: Retrieve a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The product ID to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Bad request - Invalid product ID
 */

router.get(
  "/:id",
  // validate product id using express-validator
  param("id").isInt().withMessage("Product ID must be a number"),
  // middleware to handle input errors
  handleInputErrors,
  // handler for getting a product by ID
  getProductById
);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     description: Returns the created product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              name:
 *               type: string
 *               description: The product name
 *               example: "Monitor Curvo 40 Pulgadas"
 *              price:
 *               type: number
 *               description: The product price
 *               example: 399.99
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request - Invalid product data
 */

router.post(
  "/",
  // validate product data using express-validator
  body("name")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .notEmpty()
    .withMessage("Price cannot be empty")
    .custom((value) => value > 0)
    .withMessage("Price must be greater than 0"),
  // middleware to handle input errors
  handleInputErrors,
  // handler for creating a product
  createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags:
 *       - Products
 *     description: Returns the updated product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The product ID to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              name:
 *               type: string
 *               description: The product name
 *               example: "Monitor Curvo 45 Pulgadas"
 *              price:
 *               type: number
 *               description: The product price
 *               example: 500.99
 *              availability:
 *               type: boolean
 *               description: The product availability
 *               example: true
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Bad request - Invalid product data
 */

router.put(
  "/:id",
  param("id").isInt().withMessage("Product ID must be a number"),
  body("name")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .notEmpty()
    .withMessage("Price cannot be empty")
    .custom((value) => value > 0)
    .withMessage("Price must be greater than 0"),
  body("availability")
    .isBoolean()
    .withMessage("Availability must be either true or false"),
  handleInputErrors,
  updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update the availability of a product by ID
 *     tags:
 *       - Products
 *     description: Returns the updated product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The product ID to update
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product availability updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Bad request - Invalid product data
 */

router.patch(
  "/:id",
  param("id").isInt().withMessage("Product ID must be a number"),
  handleInputErrors,
  updateAvailability
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags:
 *       - Products
 *     description: Returns a confirmation message
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The product ID to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *          application/json:
 *           schema:
 *            type: string
 *            value: Product deleted
 *       404:
 *         description: Product not found
 *       400:
 *         description: Bad request - Invalid product ID
 */

router.delete(
  "/:id",
  param("id").isInt().withMessage("Product ID must be a number"),
  handleInputErrors,
  deleteProduct
);

export default router;
