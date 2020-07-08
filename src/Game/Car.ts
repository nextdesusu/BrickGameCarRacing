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

    isMasksCollide(x, y, otherMask: carMask): boolean {
        const interStartW = Math.abs(x - this.x);
        const interStartH = this.y - y - CAR_H + 1;
        const dowW = Math.abs(interStartW - 2);
        const dowH = Math.abs(interStartH);
        for (let i = 0; i < dowW + 1; i += 1) {
            for (let j = 0; j < dowH + 1; j += 1) {
                const oi = Math.abs(CAR_W - i) - 1;
                const oj = Math.abs(CAR_H - j) - 1;
                if (this.mask[i][j] === 1 && otherMask[oi][oj] === 1) {
                    return true;
                }
            }
        }
        return false;
    }

    isBeenHit(otherCar: Car): boolean {
        const { x, y, mask } = otherCar;
        const otherW = x + CAR_W - 1;
        const otherH = y + CAR_H - 1;
        if (this.isRectanglesOverlap(x, y, otherW, otherH)) {
            return this.isMasksCollide(x, y, mask);
        }
        return false;
    }
}