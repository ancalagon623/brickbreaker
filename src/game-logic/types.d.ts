import { Container, Sprite } from 'pixi.js';

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

export type Bricks = Container;

export interface BallSprite extends SpriteWithVelocity {
  paddleCollision?: string;
}

export type PaddleSprite = SpriteWithVelocity;

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

// Game State Object
export type GameState = {
  bricks?: Bricks;
  paddle?: PaddleSprite;
  ball?: BallSprite;
};

export type GameObject = PaddleSprite | BallSprite | Bricks;
