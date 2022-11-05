import { Collisions } from '../types';
import MovingSprite from './base-models/moving-sprite';

export default class Ball extends MovingSprite {
  paddleCollision = Collisions.None;
}
