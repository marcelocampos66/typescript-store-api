import Connection from "./Connection";
import { ObjectId } from "mongodb";

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

  public async registerSale() {
    return this.connection()
      .then((db) => db.collection('sales').insertOne({}));
  }

}

export default SalesModel;
