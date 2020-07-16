import { carMask } from "./gameTypes";
import Car from "./Car";

const PLAYER_CAR: carMask = [
    [0, 1, 0, 1],
    [1, 1, 1, 0],
    [0, 1, 0, 1]
];

const ENEMY_CAR: carMask = [
    [1, 0, 1, 0],
    [0, 1, 1, 1],
    [1, 0, 1, 0]
];

const randomInteger = (min: number, max: number): number => {
    const rand: number = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

export default class Fabric {
    tableWidth: number;
    constructor(tableWidth) {
        this.tableWidth = tableWidth;
    }

    spawnEnemyCar(): Car {
        const x: number = randomInteger(1, this.tableWidth - 4);
        const y: number = -4;
        return new Car(ENEMY_CAR, x, y);
    }

    spawnPlayerCar(): Car {
        const x = Math.floor((this.tableWidth + 3) / 2);
        const y = 15;
        return new Car(PLAYER_CAR, x, y);
    }
}