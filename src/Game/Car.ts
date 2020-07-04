import { carMask } from "./gameTypes";
import { CAR_W, CAR_H } from "./consts";

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

    isRectanglesOverlap(x2: number, y2: number, w2: number, h2: number): boolean {
        const x1 = this.x;
        const y1 = this.y;
        const w1 = this.x + CAR_W - 1;
        const h1 = this.y + CAR_H - 1;
        if ((x1 > w2)
            || (w1 < x2)
            || (y1 > h2)
            || (h1 < y2)
        ) return false;
        return true
    }

    isMasksCollide(sx, sy, otherMask: carMask): boolean {
        let ti = sx, oi = CAR_W - 1;
        let tj = sy, oj = CAR_H - 1;
        for (; ti < CAR_W && oi > -1; ti++, oi--) {
            for (; tj < CAR_H && oj > -1; tj++, oj--) {

            }
        }
        return true;
    }

    isBeenHit(otherCar: Car): boolean {
        const { x, y, mask } = otherCar;
        const otherW = x + mask.length - 1;
        const otherH = y + mask[0].length - 1;
        if (this.isRectanglesOverlap(x, y, otherW, otherH)) {
            return this.isMasksCollide(x, y, mask);
        }
        return false;
    }
}