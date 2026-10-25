import React, {createContext, useContext} from 'react';
import {useCurrentFrame} from 'remotion';
import {FPS} from './consts';

/** Absolute voice-over time (s) at which the enclosing scene's local frame 0 sits. */
const TimeCtx = createContext(0);

export const SceneTime: React.FC<{start: number; children: React.ReactNode}> = ({start, children}) => (
  <TimeCtx.Provider value={start / FPS}>{children}</TimeCtx.Provider>
);

/** Current absolute voice-over time in seconds (sync everything to this). */
export const useT = (): number => {
  const frame = useCurrentFrame();
  return useContext(TimeCtx) + frame / FPS;
};
