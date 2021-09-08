import express, { Request, Response, NextFunction } from 'express';
import Middlewares from '../middlewares/Middlewares';
import { TSalesService } from '../Type';
import { Document } from 'mongodb';

type saleRegister = {
  message: string;
} | Document

class SalesController extends Middlewares {
  public router: express.Router;
  private service: TSalesService;

  constructor(SalesService: TSalesService) {
    super();
    this.router = express.Router();
    this.service = SalesService;
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getAllSales);
    this.router.get('/:id', this.getSaleById);
    this.router.post('/', [
      this.verifyAllSaleProductsData,
      this.allProductsFromSaleExists,
      this.registerSale,
    ]);
    this.router.put('/:id', [
      this.verifySaleId,
      this.verifyAllSaleProductsData,
      this.allProductsFromSaleExists,
      this.updateSale,
    ]);
    this.router.delete('/:id', [
      this.verifySaleId,
      this.deleteSale,
    ]);
  }

  private getAllSales = async (
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const result = await this.service.getAllSales();
    return res.status(200).json(result);
  };

  private getSaleById = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const { params: { id } } = req;
    const result = await this.service.getSaleById(id);
    return res.status(200).json(result);
  };

  private registerSale = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { body } = req;
    const result = await this.service.registerSale(body) as saleRegister;
    if (result.message) {
      return next({ status: 400, message: result.message });
    }
    return res.status(201).json(result);
  };

  private updateSale = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { params: { id }, body } = req;
    const result = await this.service.updateSale(id, body) as saleRegister;
    if (result.message) {
      return next({ status: 400, message: result.message });
    }
    return res.status(200).json(result);
  };

  private deleteSale = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const { params: { id } } = req;
    await this.service.deleteSale(id);
    return res.status(200).json({ message: 'Sale successfully deleted' });
  }

}

export default SalesController;
