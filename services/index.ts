import models from '../models';
import ProductsService from './ProductsService';

export default {
  ProductsService: new ProductsService(models),
};
