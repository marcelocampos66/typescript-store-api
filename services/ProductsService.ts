import { IModels, IProductEntries, TProductsModel } from "../Type";

class ProductsService {
  private productsModel: TProductsModel;

  constructor(models: IModels) {
    this.productsModel = models.ProductsModel;
  }

  public async getAllProducts() {
    const products = await this.productsModel.getAllProducts();
    return products;
  }

  public async getProductById(id: string) {
    const product = await this.productsModel.getProductById(id);
    if (!product) {
      return { message: "Product not found" };
    }
    return product;
  }

  public async registerProduct(product: IProductEntries) {
    const { name, quantity, price } = product;
    const { insertedId } = await this.productsModel.registerProduct({ name, quantity, price });
    const productId = insertedId.toString();
    const registeredProduct = await this.productsModel.getProductById(productId)
    return registeredProduct;
  }

  public async updateProduct(id: string, newInfos: IProductEntries) {
    await this.productsModel.updateProduct(id, newInfos);
    const updatedProduct = await this.productsModel.getProductById(id);
    return updatedProduct;
  }

  public async deleteProduct(id: string) {
    await this.productsModel.deleteProduct(id);
    return { message: 'Product deleted successfully' };
  }

}

export default ProductsService;
