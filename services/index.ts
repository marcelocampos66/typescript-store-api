import models from '../models';
import ProductsService from './ProductsService';
import SalesService from './SalesService';

export default {
  ProductsService: new ProductsService(models),
  SalesService: new SalesService(models),
};
