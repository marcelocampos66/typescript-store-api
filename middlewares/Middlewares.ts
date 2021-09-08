import { Request, Response, NextFunction } from 'express';
import joi from 'joi';
import { Document, ObjectId } from 'mongodb';
import models from '../models';
import { IModels, IProductEntries, ISaleProduct } from '../Type';

class Middlewares {
  private models: IModels

  constructor() {
    this.models = models;
  }

  private productDataJoi = (product: IProductEntries) => (
    joi.object({
      name: joi.string().min(3).required(),
      quantity: joi.number().integer().min(1).required(),
      price: joi.number().min(1).required(),
    }).validate(product)
  );

  private productSaleDataJoi = (producSale: ISaleProduct) => (
    joi.object({
      id: joi.string().length(24).required(),
      quantity: joi.number().integer().min(1).required(),
    }).validate(producSale)
  );

  public verifyProductData = (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    const { body: { name, quantity, price } } = req;
    const { error } = this.productDataJoi({ name, quantity, price });
    if (error) {
      return next({ status: 422, message: error.details[0].message });
    }
    return next();
  };

  public verifyProductExists = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    const { body: { name } } = req;
    const productExists = await this.models.ProductsModel.getProductByName(name);
    if (productExists) {
      return next({ status: 403, message: 'Product already exists' });
    }
    return next();
  };

  public verifyProductId = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    const { params: { id } } = req;
    if (!ObjectId.isValid(id)) {
      return next({ status: 403, message: 'Invalid Id' });
    }
    const productExists = await this.models.ProductsModel.getProductById(id);
    if (!productExists) {
      return next({ status: 404, message: 'Product dont exists' });
    }
    return next();
  };

  public verifySaleId = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    const { params: { id } } = req;
    if (!ObjectId.isValid(id)) {
      return next({ status: 403, message: 'Invalid Id' });
    }
    const saleExists = await this.models.SalesModel.getSaleById(id);
    if (!saleExists) {
      return next({ status: 404, message: 'Sale dont exists' });
    }
    return next();
  };

  public verifyAllSaleProductsData = (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    const { body } = req;
    body.forEach((product: ISaleProduct) => {
      const { error } = this.productSaleDataJoi(product);
      if (error) {
        return next({ status: 422, message: 'Invalid product' });
      }
    })
    return next();
  };

  public allProductsFromSaleExists = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    const { body } = req;
    const products = await this.models.ProductsModel.getAllProducts();
    const saleProductsIds = body.map((product: ISaleProduct) => product.id);
    const productsIds = products
      .map((product: Document) => product._id.toString());
    const allProductsExists = saleProductsIds
      .every((name: string) => productsIds.includes(name));
    if (!allProductsExists) {
      return next({ status: 403, message: 'Some products are not available' });
    }
    return next();
  };

}

export default Middlewares;
