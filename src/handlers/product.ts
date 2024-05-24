import { Request, Response } from "express";
import Product from "../models/Product.model";

export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.findAll({
    // order by id
    order: [["id", "DESC"]],
  });

  res.json({ data: products });
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json({ data: product });
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, availability } = req.body;

  const product = await Product.create({ name, price, availability });

  product.save();

  res.status(201).json({ data: product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, availability } = req.body;

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  await product.update({ name, price, availability }); // Partial update with update method()

  await product.save();

  res.json({ data: product });
};

export const updateAvailability = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  product.availability = !product.dataValues.availability;

  await product.save();

  res.json({ data: product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  await product.destroy();

  res.json({ data: "Product deleted" });
};
