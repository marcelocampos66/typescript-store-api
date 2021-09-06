import { Request, Response, NextFunction } from 'express';
import joi from 'joi';
import { ObjectId } from 'mongodb';
import models from '../models';
import { IModels, IProductEntries } from '../Type';

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
    res: Response,
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

}

export default Middlewares;
