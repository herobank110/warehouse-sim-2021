import { Actor, Scene } from 'excalibur';

export function attachActorToActor(target: Actor, parent: Actor | Scene) {
  (target.scene || target.parent)?.remove(target);
  parent.add(target);
}
