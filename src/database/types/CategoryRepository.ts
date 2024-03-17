import { Category, Product } from "../../generated/graphql";

export interface CategoryWriteModel extends Omit<Category, "products"> {
  products: string[];
}

export interface CategoryRepository {
  create(category: CategoryWriteModel): Promise<void>;
  appendProduct(id: Category["id"], productId: Product["id"]): Promise<void>;
  findProductCategories(
    productId: Product["id"]
  ): Promise<CategoryWriteModel[]>;
  findAll(): Promise<CategoryWriteModel[]>;
}
