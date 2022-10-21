import { Container, Sprite } from 'pixi.js';

export enum Collisions {
  Vertical,
  Horizontal,
  None,
}

export interface SpriteWithVelocity extends Sprite {
  vx?: number;
  vy?: number;
  borders?: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };
}

export type BrickContainer = Container;

export interface BallSprite extends SpriteWithVelocity {
  paddleCollision?: string;
}

export type PaddleSprite = SpriteWithVelocity;

export interface Brick extends Sprite {
  collision?: {
    _warning: Collisions;
    type: Collisions;
    broken: boolean;
  };
}

// Input listeners for the game control keys
export interface KeyObject {
  value: string;
  [key: string]: any;
  press?: () => void;
  release?: () => void;
  downHandler?: (event: KeyboardEvent) => void;
  upHandler?: (event: KeyboardEvent) => void;
  unsubscribe?: () => void;
}

export interface Config {
  width: number;
  height: number;
}

// Game State Object
export type GameState = {
  config: Config;
  renderList: {
    bricks?: BrickContainer;
    paddle?: PaddleSprite;
    ball?: BallSprite;
  };
};

export type GameObject = PaddleSprite | BallSprite | BrickContainer;
