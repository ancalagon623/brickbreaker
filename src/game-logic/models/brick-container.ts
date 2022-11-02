import { Container } from 'pixi.js';
import { BrickSprite } from '../types';

export default class Bricks extends Container {
  children: BrickSprite[] = [];
}
