import ProductsController from "./controllers/ProductsController";
import ProductsService from './services/ProductsService';
import ProductsModel from './models/ProductsModel';
import SalesController from './controllers/SalesController';
import SalesService from './services/SalesService';
import SalesModel from './models/SalesModel';

type port = string | undefined;

type TProductsService = ProductsService;

type TProductsModel = ProductsModel;

type TSalesService = SalesService;

type TSalesModel = SalesModel;

interface IControllers {
  ProductsController: ProductsController;
  SalesController: SalesController;
}

interface IModels {
  ProductsModel: ProductsModel;
  SalesModel: SalesModel;
}

interface IProductEntries {
  name: string;
  quantity: number;
  price: decimal;
}

interface ISaleProduct {
  id: string;
  quantity: number;
}
