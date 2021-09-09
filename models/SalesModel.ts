import Connection from "./Connection";
import { ObjectId } from "mongodb";
import { ISale } from "../Type";

class SalesModel extends Connection {
  constructor(){
    super();
  }

  public async getAllSales() {
    return this.connection()
      .then((db) => db.collection('sales').find({}).toArray());
  }

  public async getSaleById(id: string) {
    return this.connection()
      .then((db) => db.collection('sales').findOne({ _id: new ObjectId(id) }));
  }

  public async registerSale(sale: ISale) {
    return this.connection()
      .then((db) => db.collection('sales').insertOne(sale))
      .then((result) => result);
  }

  public async updateSale(id: string, newInfos: ISale) {
    return this.connection()
      .then((db) => db.collection('sales').updateOne(
        { _id: new ObjectId(id) },
        { $set: newInfos },
      ));
  }

  public async deleteSale(id: string) {
    return this.connection()
      .then((db) => db.collection('sales').deleteOne({ _id: new ObjectId(id) }));
  }

}

export default SalesModel;
