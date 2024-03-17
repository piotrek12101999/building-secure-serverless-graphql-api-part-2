import { Product, PriceInput, Category } from "../../generated/graphql";

export interface ProductWriteModel
  extends Omit<Product, "price" | "categories"> {
  price: PriceInput;
  categories: string[];
}

export interface ProductRepository {
  create(product: ProductWriteModel): Promise<void>;
  appendCategory(id: Product["id"], categoryId: Category["id"]): Promise<void>;
  findCategoryProducts(
    categoryId: Category["id"]
  ): Promise<ProductWriteModel[]>;
  findById(id: Product["id"]): Promise<ProductWriteModel>;
  findAll(): Promise<ProductWriteModel[]>;
}
