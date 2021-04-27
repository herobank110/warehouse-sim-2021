import { Actor, Scene } from 'excalibur';

export function attachActorToActor(target: Actor, parent: Actor | Scene) {
  (target.parent || target.scene)?.remove(target);
  parent.add(target);
}
