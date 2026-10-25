import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {FPS, H, TOTAL_FRAMES, W} from './lib/consts';

export const Root: React.FC = () => (
  <Composition id="Alchemist" component={Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
);
