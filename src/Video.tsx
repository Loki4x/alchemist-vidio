import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {C} from './lib/theme';
import {FADE_FRAMES, TOTAL_FRAMES} from './lib/consts';
import {SCENE_FRAMES, SCENE_ORDER, SceneKey} from './lib/timeline';
import {SceneTime} from './lib/time';
import {Subtitles} from './Subtitles';
import {Hook} from './scenes/Hook';
import {Merge} from './scenes/Merge';
import {Methods} from './scenes/Methods';
import {MsnrIntro} from './scenes/MsnrIntro';
import {MsnrFocus} from './scenes/MsnrFocus';
import {Poi} from './scenes/Poi';
import {Aoi} from './scenes/Aoi';
import {Outro} from './scenes/Outro';

const SCENES: Record<SceneKey, React.FC> = {
  hook: Hook,
  merge: Merge,
  methods: Methods,
  intro: MsnrIntro,
  focus: MsnrFocus,
  poi: Poi,
  aoi: Aoi,
  outro: Outro,
};

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  return <div style={{position: 'absolute', left: 0, top: 0, height: 5, width: `${(frame / TOTAL_FRAMES) * 100}%`, background: C.em}} />;
};

export const Video: React.FC = () => {
  const children: React.ReactNode[] = [];
  SCENE_ORDER.forEach((key, i) => {
    const start = SCENE_FRAMES[key];
    const nextKey = SCENE_ORDER[i + 1];
    const duration = nextKey ? SCENE_FRAMES[nextKey] - start + FADE_FRAMES : TOTAL_FRAMES - start;
    const Scene = SCENES[key];
    children.push(
      <TransitionSeries.Sequence key={key} name={key} durationInFrames={duration}>
        <SceneTime start={start}>
          <Scene />
        </SceneTime>
      </TransitionSeries.Sequence>,
    );
    if (nextKey) {
      children.push(
        <TransitionSeries.Transition key={`t-${key}`} presentation={fade()} timing={linearTiming({durationInFrames: FADE_FRAMES})} />,
      );
    }
  });

  return (
    <AbsoluteFill style={{background: C.bg}}>
      <TransitionSeries>{children}</TransitionSeries>
      <Subtitles />
      <Progress />
      <Audio src={staticFile('vo.mp3')} volume={1} />
    </AbsoluteFill>
  );
};
