import { Request } from "express";

export interface IRequestWithLocal extends Request {
    local?: any;
}