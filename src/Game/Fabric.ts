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
    player: Car;
    enemies: Array<Car>;
    constructor(tableWidth) {
        this.tableWidth = tableWidth;
        this.enemies = []
    }

    spawnEnemyCar(): void {
        const x: number = randomInteger(1, this.tableWidth - 4);
        const y: number = -4;
        const enemy = new Car(ENEMY_CAR, x, y);
        this.enemies.push(enemy);
    }

    removeEnemy(toRemove: Car) {
        this.enemies = this.enemies.filter((enemy) => enemy !== toRemove);
    }

    spawnPlayerCar(): void {
        const x = Math.floor((this.tableWidth + 3) / 2);
        const y = 15;
        const player = new Car(PLAYER_CAR, x, y);
        this.player = player;
    }
}