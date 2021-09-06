import { IModels, ISaleProduct, TProductsModel, TSalesModel } from "../Type";
import { Document } from 'mongodb';

class SalesService {
  private salesModel: TSalesModel;
  private productsModel: TProductsModel;

  constructor(models: IModels) {
    this.salesModel = models.SalesModel;
    this.productsModel = models.ProductsModel;
  }

  private async verifyStocks(products: Array<ISaleProduct>) {
    products.forEach(async (product) => {
      const productOnStock = await this.productsModel.getProductById(product.id) as Document;
      if (product.quantity > productOnStock.quantity) {
        console.log('entrou aqui');
        return false;
      }
    });
    return true;
  }

  public async registerSale(products: Array<ISaleProduct>) {
    const hasAllProductsOnStock = await this.verifyStocks(products);
    console.log(hasAllProductsOnStock);
  }

}

export default SalesService;
