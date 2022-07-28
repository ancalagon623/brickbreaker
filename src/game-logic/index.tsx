import * as PIXI from 'pixi.js';

export const appDimensions = { w: 640, h: 690, scale: 0.4 };

const app = new PIXI.Application({
  width: appDimensions.w,
  height: appDimensions.h,
  backgroundColor: 0x000000,
});

export default app;
