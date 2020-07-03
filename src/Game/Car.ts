import { carMask } from "./gameTypes";

export default class Car {
    mask: carMask;
    x: number;
    y: number;
    constructor(mask: carMask, x: number, y: number) {
        this.mask = mask;
        this.x = x;
        this.y = y;
    }

    move(x, y): void {
        this.x = x;
        this.y = y;
    }
}