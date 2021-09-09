import Connection from './Connection';
import { ObjectId } from 'mongodb';
import { INewQuatity, IProductEntries } from '../Type';

class ProductsModel extends Connection {
  constructor(){
    super();
  }

  public async getProductByName(name: string) {
    return this.connection()
      .then((db) => db.collection('products').findOne({ name }));
  }

  public async getAllProducts() {
    return this.connection()
      .then((db) => db.collection('products').find({}).toArray());
  }

  public async getProductById(id: string) {
    return this.connection()
      .then((db) => db.collection('products').findOne({ _id: new ObjectId(id) }));
  }

  public async registerProduct({ name, quantity, price }: IProductEntries) {
    return this.connection()
      .then((db) => db.collection('products').insertOne({ name, quantity, price }))
      .then((result) => result);
  }

  public async updateProduct(id: string, newInfos: IProductEntries) {
    return this.connection()
      .then((db) => db.collection('products').updateOne(
        { _id: new ObjectId(id) },
        { $set: newInfos },
      ));
  }

  public async updateProductQuantity(id: string, newQuantity: number) {
    return this.connection()
      .then((db) => db.collection('products').updateOne(
        { _id: new ObjectId(id) },
        { $set: { quantity: newQuantity } },
      ));
  }

  public async deleteProduct(id: string) {
    return this.connection()
      .then((db) => db.collection('products')
      .deleteOne({ _id: new ObjectId(id) }));
  }

  public async getAllProductsFromSale(ids: Array<string>) {
    const objIdArray = ids.map((id) => ( new ObjectId(id) ));
    return this.connection()
      .then((db) => db.collection('products').find({
        _id: { $in: objIdArray },
      }).toArray());
  }

}

export default ProductsModel;
