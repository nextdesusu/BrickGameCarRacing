import { GAME_TABLE, BG_COLOR, M_COLOR, SM_COLOR } from "./consts";
import { carMask } from "./gameTypes";
import Fabric from "./Fabric";

export const startGame = (ctx: null | any, width: number, height: number): void => {
    //w = 10
    //h = 20
    //ctx.fillRect(0, 0, width, height);
    const cellSizeW: number = Math.floor(width / 20);
    const cellSizeH: number = Math.floor(height / 20);
    const fabric: Fabric = new Fabric();
    fabric.spawnPlayer(1, 4);
    const gameLoop = () => {
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = SM_COLOR;
        ctx.fillStyle = SM_COLOR;
        for (let x = 0; x < GAME_TABLE.length; x++) {
            for (let y = 0; y < GAME_TABLE[x].length; y++) {
                ctx.strokeRect(x * cellSizeW, y * cellSizeH, cellSizeW, cellSizeH);
                ctx.fillRect(x * cellSizeW + 5, y * cellSizeH + 5, cellSizeW - 10, cellSizeH - 10)
            }
        }
        const player = fabric.player;
        const mask = player.mask;
        ctx.strokeStyle = M_COLOR;
        ctx.fillStyle = M_COLOR;
        for (let x = 0; x < mask.length; x++) {
            for (let y = 0; y < mask[x].length; y++) {
                if (mask[x][y] === 1) {
                    const nx = x + player.x;
                    const ny = y + player.y;
                    ctx.strokeRect(nx * cellSizeW, ny * cellSizeH, cellSizeW, cellSizeH);
                    ctx.fillRect(nx * cellSizeW + 5, ny * cellSizeH + 5, cellSizeW - 10, cellSizeH - 10)
                }
            }
        }
    }
    gameLoop();
}