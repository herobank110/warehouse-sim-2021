import { Vector } from 'excalibur';

export function lerp1(a: number, b: number, x: number) {
  return a + (b - a) * x;
}

export function lerp2(a: Vector, b: Vector, x: number) {
  return a.add(b.sub(a).scale(x));
}

export function iota(n: number) {
  const ret = [];
  for (let i = 0; i < n; i++) ret.push(i);
  return ret;
}
