import db from "../config/database";
import { InsertUser, SelectUser, userTable } from "./Auth";
import { cartTable, InsertCart, SelectCart } from "./Cart";
import { categoryTable, InsertCategory, SelectCategory } from "./Category";
import { InsertProduct, productTable, SelectProduct } from "./Product";

export async function insertUser(user: InsertUser): Promise<SelectUser[]> {
    return db.insert(userTable).values(user).returning();
}

export async function insertCategory(
    category: InsertCategory,
): Promise<SelectCategory[]> {
    return db.insert(categoryTable).values(category).returning();
}

export async function insertCart(cart: InsertCart): Promise<SelectCart[]> {
    return db.insert(cartTable).values(cart).returning();
}

export async function insertProduct(
    product: InsertProduct,
): Promise<SelectProduct[]> {
    return db.insert(productTable).values(product).returning();
}