import services from '../services';
import ProductsController from './ProductsController';

export default {
  products: new ProductsController(services.ProductsService),
};
