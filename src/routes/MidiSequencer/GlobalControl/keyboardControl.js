import { useCallback, useContext, useEffect, useRef } from 'react';
import {
  MidiMessages,
  defaultIgnoreMessages as ignoreMessages,
} from 'lib/enums';
import MidiContext from 'components/Midi/Context';
import { isFunc } from 'lib/utils';

const useKeyboardControl = ({ onPlay, onSeekToStart, onStop }) => {
  const { ready, subscribe } = useContext(MidiContext);

  const ref = useRef({
    onPlay,
    onSeekToStart,
    onStop,
    unsubscribe: null,
  });

  useEffect(() => {
    ref.current.onPlay = onPlay;
    ref.current.onSeekToStart = onSeekToStart;
    ref.current.onStop = onStop;
  }, [onPlay, onSeekToStart, onStop]);

  const handleMidiMessage = useCallback(([message]) => {
    if (
      message === MidiMessages.StartPlayback &&
      isFunc(ref.current.onSeekToStart) &&
      isFunc(ref.current.onPlay)
    ) {
      ref.current.onSeekToStart();
      ref.current.onPlay();
    } else if (
      message === MidiMessages.ResumePlayback &&
      isFunc(ref.current.onPlay)
    )
      ref.current.onPlay();
    else if (
      message === MidiMessages.PausePlayback &&
      isFunc(ref.current.onStop)
    )
      ref.current.onStop();
  }, []);

  // subscribe when midi context ready
  useEffect(() => {
    if (ready)
      ref.current.unsubscribe = subscribe(handleMidiMessage, {
        ignoreMessages,
      });

    return () =>
      ready &&
      typeof ref.current.unsubscribe === 'function' &&
      ref.current.unsubscribe();
  }, [ready]);

  // cleanup effect
  useEffect(() => {}, []);
};

export { useKeyboardControl };
