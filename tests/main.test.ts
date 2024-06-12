import { it, describe } from "vitest";
import {faker} from '@faker-js/faker';
import { db } from "./mocks/db";

describe('testSetup', () => {
    it('should', () => {
    const product = db.product.create({name: 'Apple'});
    const allProduct = db.product.getAll();
       console.log(allProduct)
    })
})
