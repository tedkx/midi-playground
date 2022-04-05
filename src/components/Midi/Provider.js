import React from 'react';
import MidiContext from './Context';
import SettingsModal from './SettingsModal';
import { MidiPortState } from 'lib/enums';
import { debounce } from 'lodash';
const preferredInputName = 'MODX-1';
const preferredOutputName = 'MODX-1';

const MidiContextProvider = ({ children }) => {
  const [settingsVisible, setSettingsVisibe] = React.useState(false);
  const ref = React.useRef({ midi: null });

  const defaultContextValue = React.useMemo(
    () => ({
      error: null,
      initialize: null,
      ready: false,
      selectedInput: null,
      selectedOutput: null,
      sysex: false,
      toggleSettings: () => setSettingsVisibe(current => !current),
    }),
    []
  );
  const [contextValue, setContextValue] = React.useState(defaultContextValue);

  // add new connected inputs/outputs and discard disconnected from context
  const onConnectionStateChanged = React.useCallback(
    e => {
      if (e.port.state === MidiPortState.Connected) {
        const inputs = Array.from(ref.current.midi.inputs.values()).filter(
          input => input.state === MidiPortState.Connected
        );
        const outputs = Array.from(ref.current.midi.outputs.values()).filter(
          input => input.state === MidiPortState.Connected
        );

        setContextValue(currentCtx => ({ ...currentCtx, inputs, outputs }));
      } else {
        // go to next input/output, if disconnected port was selected
        setContextValue(currentCtx => {
          const inputs = Array.from(ref.current.midi.inputs.values()).filter(
            input => input.state === MidiPortState.Connected
          );
          const outputs = Array.from(ref.current.midi.outputs.values()).filter(
            input => input.state === MidiPortState.Connected
          );
          const newSelectedInput =
            (!inputs.some(
              input => input.name === currentCtx.selectedInput?.name
            ) &&
              inputs[0]) ||
            null;
          const newSelectedOutput =
            (!outputs.some(
              output => output.name === currentCtx.selectedOutput?.name
            ) &&
              outputs[0]) ||
            null;

          return newSelectedInput !== false ||
            newSelectedOutput !== false ||
            inputs.length !== currentCtx.inputs?.length ||
            outputs.length !== currentCtx.outputs?.length
            ? {
                ...currentCtx,
                inputs,
                outputs,
                selectedInput: newSelectedInput,
                selectedOutput: newSelectedOutput,
              }
            : currentCtx;
        });
      }
    },
    [setContextValue]
  );

  const handleConnectionStateChanged = React.useMemo(
    () => debounce(onConnectionStateChanged, 100),
    [onConnectionStateChanged]
  );

  const initialize = React.useCallback(
    sysex => {
      setContextValue(defaultContextValue);
      return navigator
        .requestMIDIAccess({ sysex: sysex === true })
        .then(midi => {
          ref.current.midi = midi;

          midi.onstatechange = handleConnectionStateChanged;

          setContextValue(ctx => {
            const inputs = Array.from(midi.inputs.values()).filter(
              i => i.state === 'connected'
            );
            const outputs = Array.from(midi.outputs.values()).filter(
              o => o.state === 'connected'
            );

            const newContext = {
              ...ctx,
              inputs,
              outputs,
              ready: true,
              sysex: sysex === true,
            };

            // try to preserve previous input, if available
            newContext.selectedInput =
              inputs.find(i => i.id === ctx.selectedInput) ||
              inputs.find(i => i.name.indexOf(preferredInputName) >= 0) ||
              inputs[0] ||
              null;

            // same for outputs
            newContext.selectedOutput =
              outputs.find(o => o.id === ctx.selectedOutput) ||
              outputs.find(o => o.name.indexOf(preferredOutputName) >= 0) ||
              outputs[0] ||
              null;

            return newContext;
          });
        })
        .catch(ex =>
          setContextValue({
            ...defaultContextValue,
            initialize,
            error: ex.message,
          })
        );
    },
    [setContextValue]
  );

  React.useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <MidiContext.Provider value={contextValue}>
        {children}
      </MidiContext.Provider>
      <SettingsModal
        contextValue={contextValue}
        onCancel={defaultContextValue.toggleSettings}
        onOk={defaultContextValue.toggleSettings}
        setContextValue={setContextValue}
        visible={settingsVisible}
      />
    </>
  );
};

export default MidiContextProvider;
