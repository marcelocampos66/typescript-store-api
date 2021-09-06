import ProductsService from './services/ProductsService';
import ProductsController from "./controllers/ProductsController";
import ProductsModel from './models/ProductsModel';

type port = string | undefined;

type TProductsService = ProductsService;

type TProductsModel = ProductsModel;

interface IControllers {
  products: ProductsController;
}

interface IModels {
  ProductsModel: ProductsModel;
}

interface IProductEntries {
  name: string;
  quantity: number;
  price: decimal;
}
