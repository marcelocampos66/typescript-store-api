import express, { Request, Response, NextFunction } from 'express';
import Middlewares from '../middlewares/Middlewares';
import { TProductsService } from '../Type';

class ProductsController extends Middlewares {
  public router: express.Router;
  private service: TProductsService

  constructor(ProductsService: TProductsService) {
    super();
    this.router = express.Router();
    this.service = ProductsService;
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getAllProducts);
    this.router.get('/:id', this.getProductById);
    this.router.post('/', [
      this.verifyProductData,
      this.verifyProductExists,
      this.registerProduct,
    ]);
    this.router.put('/:id', [
      this.verifyProductData,
      this.verifyProductId,
      this.updateProduct,
    ]);
    this.router.delete('/:id', [
      this.verifyProductId,
      this.deleteProduct,
    ]);
  };

  private getAllProducts = async (
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.service.getAllProducts();
    return res.status(200).json(result);
  };

  private getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { params: { id } } = req;
    const result = await this.service.getProductById(id);
    if (result.message) {
      return next({ status: 404, message: result.message });
    }
    return res.status(200).json(result);
  };

  private registerProduct = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const { body } = req;
    const result = await this.service.registerProduct(body);
    return res.status(201).json(result);
  };

  private updateProduct = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const { params: { id }, body } = req;
    const result = await this.service.updateProduct(id, body);
    return res.status(200).json(result);
  }

  private deleteProduct = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const { params: { id } } = req;
    const result = await this.service.deleteProduct(id);
    return res.status(200).json(result);
  }

}

export default ProductsController;
