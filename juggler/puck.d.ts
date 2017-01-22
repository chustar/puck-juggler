export var LED1: Pin;
export var LED2: Pin;
export var LED3: Pin;
export var BTN: Pin;

export class Pin {
    write(value: number);
}

export enum SampleRate {
    Hz_80, // 900uA
    Hz_40, // 550uA
    Hz_20, // 275uA
    Hz_10, // 137uA
    Hz_5, // 69uA
    Hz_2_5, // 34uA
    Hz_1_25, // 17uA
    Hz_0_63, // 8uA
    Hz_0_31, // 8uA
    Hz_0_16, // 8uA
    Hz_0_08 // 8uA
}

export class MagReading {
    x: number;
    y: number;
    z: number;
}

declare namespace Puck {
    function capSense(tx, rx): number;
    function getBatteryPercentage(): number;
    function IR(data: number[]);
    function light(): number;
    function mag(): MagReading;
    function magOff(): void;
    function magOn(samplerate: SampleRate);
    function selfTest(): boolean;
}