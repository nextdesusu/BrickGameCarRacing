export type carMask = Array<Array<number>>;

export interface controls {
    positionX: number;
    pause: boolean;
}

export interface statistics {
    score: number;
    speed: number;
}

export interface scoreSign {
    name: string;
    score: number;
}

export interface gameConfig {
    ctx: any;
    width: number;
    height: number;
    controls: any;
    tableWidth: number;
    stats: statistics;
    finish: () => void;
    lostSound: any;
}