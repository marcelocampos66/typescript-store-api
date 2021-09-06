import services from '../services';
import ProductsController from './ProductsController';
import SalesController from './SalesController';

export default {
  ProductsController: new ProductsController(services.ProductsService),
  SalesController: new SalesController(services.SalesService),
};
