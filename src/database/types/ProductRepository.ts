import { Product, PriceInput } from "../../generated/graphql";

export interface ProductWriteModel extends Omit<Product, "price"> {
  price: PriceInput;
}

export interface ProductRepository {
  create(product: ProductWriteModel): Promise<void>;
  findById(id: Product["id"]): Promise<ProductWriteModel>;
  findAll(): Promise<ProductWriteModel[]>;
}
