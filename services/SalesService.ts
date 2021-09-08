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
    let isOk = true;
    const productsIds = products.map((product) => product.id);
    const saleProducts = await this.productsModel.getAllProductsFromSale(productsIds);
    products.forEach((product) => {
      const productOnStock = saleProducts
        .find(({ _id }) => _id.toString() === product.id) as Document;
      if (productOnStock.quantity < product.quantity) {
        isOk = false;
      }
    });
    return isOk;
  }

  private priceFormater(price: number) {
    const formater = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BRL',
    });
    return formater.format(price);
  }

  private getTotalPrice(products: Array<ISaleProduct>) {
    const totalPrice = products
      .reduce((totalPrice, product) => totalPrice + product.quantity, 0);
    return this.priceFormater(totalPrice);
  }

  private async updateQuantityRegister(products: Array<ISaleProduct>) {
    const productsIds = products.map((product) => product.id);
    const saleProducts = await this.productsModel.getAllProductsFromSale(productsIds);
    products.forEach(async (product) => {
      const productOnStock = saleProducts
        .find(({ _id }) => _id.toString() === product.id) as Document;
      const newQuantity = productOnStock.quantity - product.quantity;
      await this.productsModel
        .updateProductQuantity(product.id, newQuantity);
    });
  }

  private async updateQuantityUpdate(saleId: string, newSale: Array<ISaleProduct>) {
    const productsIds = newSale.map((item) => item.id);
    const saleProducts = await this.productsModel.getAllProductsFromSale(productsIds);
    const { products: oldSaleProducts } = await this.salesModel.getSaleById(saleId) as Document;
    newSale.forEach(async (product) => {
      const productOnStock = saleProducts
        .find(({ _id }) => _id.toString() === product.id) as Document;
      const productOnOldSale = oldSaleProducts
        .find((item: ISaleProduct) => item.id === product.id);
      // 
      const newQuantity = productOnOldSale.quantity > product.quantity
        ? productOnStock.quantity - (productOnOldSale.quantity - product.quantity)
        : productOnStock.quantity + (product.quantity - productOnOldSale.quantity);
      await this.productsModel
        .updateProductQuantity(product.id, newQuantity);
    });
  }

  private async updateQuantityDelete(id: string, products: Array<ISaleProduct>) {

  }

  public async getAllSales() {
    const sales = await this.salesModel.getAllSales();
    return sales;
  }

  public async getSaleById(id: string) {
    const sale = await this.salesModel.getSaleById(id);
    return sale;
  }

  public async registerSale(products: Array<ISaleProduct>) {
    const hasAllProductsOnStock = await this.verifyStocks(products);
    if (!hasAllProductsOnStock) {
      return { message: 'Some products are not available' };
    }
    const totalPrice = this.getTotalPrice(products);
    const { insertedId } = await this.salesModel.registerSale({ products, totalPrice });
    const saleId = insertedId.toString();
    await this.updateQuantityRegister(products);
    const insertedSale = await this.salesModel.getSaleById(saleId);
    return insertedSale;
  }

  public async updateSale(id: string, products: Array<ISaleProduct>) {
    const hasAllProductsOnStock = await this.verifyStocks(products);
    if (!hasAllProductsOnStock) {
      return { message: 'Some products are not available' };
    }
    const totalPrice = this.getTotalPrice(products);
    await this.salesModel.updateSale(id, { products, totalPrice });
    await this.updateQuantityUpdate(id, products);
    const updatedSale = await this.salesModel.getSaleById(id);
    return updatedSale;
  }

  public async deleteSale(id: string) {
    await this.salesModel.deleteSale(id);
  }

}

export default SalesService;
