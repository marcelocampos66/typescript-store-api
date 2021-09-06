import express, { Request, Response, NextFunction } from 'express';
import Middlewares from '../middlewares/Middlewares';
import { TSalesService } from '../Type';

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
    this.router.get('/', (_req, res) => { res.json({ message: 'pong' }) });
    this.router.post('/', [
      this.verifyAllSaleProductsData,
      this.allProductsFromSaleExists,
      this.registerSale,
    ]);
  }

  private registerSale = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const { body } = req;
    const result = this.service.registerSale(body);
    return res.status(201).json({ message: 'deu bom!' });
  };

}

export default SalesController;
