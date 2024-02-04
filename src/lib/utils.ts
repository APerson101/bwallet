import {clsx, type ClassValue} from "clsx";
import {cubicOut} from "svelte/easing";
import type {TransitionConfig} from "svelte/transition";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
    y?: number;
    x?: number;
    start?: number;
    duration?: number;
};

export const flyAndScale = (
    node: Element,
    params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;

    const scaleConversion = (
        valueA: number,
        scaleA: [number, number],
        scaleB: [number, number]
    ) => {
        const [minA, maxA] = scaleA;
        const [minB, maxB] = scaleB;

        const percentage = (valueA - minA) / (maxA - minA);
        const valueB = percentage * (maxB - minB) + minB;

        return valueB;
    };

    const styleToString = (
        style: Record<string, number | string | undefined>
    ): string => {
        return Object.keys(style).reduce((str, key) => {
            if (style[key] === undefined) return str;
            return str + `${key}:${style[key]};`;
        }, "");
    };

    return {
        duration: params.duration ?? 200,
        delay: 0,
        css: (t) => {
            const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
            const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
            const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

            return styleToString({
                transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                opacity: t
            });
        },
        easing: cubicOut
    };
};





export type TokenType = {
    id:string;
    address:string;
    name:string;
    decimals:number;
    type:string;
    icon_url:string;
    symbol:string;
    exchange_rate:string;
}

export type UserToken = {
    token: TokenType;
    balance: string;
}

export type AccountType = {
    address: string;
    privateKey: string;
    value: string;
    balance: string;
    tokens: UserToken[];
    nfts:UserToken[];
    savingsAddress:string;
    lockPeriod?:string;
    staking:StakingInfo | null;
    receipts:ReceiptType[];
}

export type Ltoken = {
    amount: string,
    lockId: string,
    sentDate: string,
    releaseDate: string
}
export type LockedFunds = {
    address:string;
    value:string;
    tokens:Ltoken [];
}

export type ReceiptType = {
    address:string;
    date:string;
    value:string;
    savings: SavingsType[]
}

export type SavingsType = {
    dateStarted:string;
    dateEnding:string;
    amountLocked:string;
    type:string;
    token: TokenType;
    balance: string;
    location: string;
    link: string;
}


export type StakingInfo = {
    name:string;
    link:string;
}


export type DappConnection = {
    name:string;
    url:string;
    topic:string;
    documentId?:string;
    icon?:string;
}