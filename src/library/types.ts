import { Request } from "express";

export interface IRequestWithLocal extends Request {
    local?: any;
}

export interface ProductsWithOffer {
    productId: string | null;
    productName: string | null;
    productDescription: string | null;
    quantity: number | null;
    price: number | null;
    image: string | null;
    offerValue: number | null;
}
