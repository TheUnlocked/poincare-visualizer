import { complex, exp, MathNumericType } from 'mathjs';

export function column<T extends MathNumericType>(...nums: T[]) {
    return nums.map(x => [x]);
}

export function rotLinear(theta: number) {
    return [
        [Math.cos(theta / 2), Math.sin(theta / 2)],
        [-Math.sin(theta / 2), Math.cos(theta / 2)],
    ];
}

export function rotCircular(theta: number) {
    const sin = Math.sin(theta);
    const cos = Math.cos(theta);
    const sin2 = sin**2;
    const cos2 = cos**2;
    const cos_sin = cos * sin;
    return [
        [complex(cos2, sin2), complex(-cos_sin, cos_sin)],
        [complex(-cos_sin, cos_sin), complex(sin2, cos2)],
    ];
}

export function blochRotZ(theta: number) {
    const neg_i_sin = complex(0, -Math.sin(theta / 2));
    const cos = Math.cos(theta / 2);
    return [
        [cos, neg_i_sin],
        [neg_i_sin, cos],
    ];
}

export function blochRotX(theta: number) {
    const sin = Math.sin(theta / 2);
    const cos = Math.cos(theta / 2);
    return [
        [cos, -sin],
        [sin, cos],
    ];
}

export function blochRotY(theta: number) {
    return [
        [exp(complex(0, -theta / 2)), 0],
        [0, exp(complex(0, theta / 2))],
    ];
}

export const i = complex(0, 1);