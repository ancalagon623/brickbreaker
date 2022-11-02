import { Container } from 'pixi.js';
import { Brick } from '../types';

export default class BrickContainer extends Container {
  children: Brick[] = [];
}
