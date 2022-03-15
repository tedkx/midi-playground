import React from 'react';
import MidiContext from './Context';
import SettingsModal from './SettingsModal';

const defaultInputName = 'MODX-1';
const defaultOutputName = 'MODX-1';

const MidiContextProvider = ({ children }) => {
  const [settingsVisible, setSettingsVisibe] = React.useState(false);

  const defaultContextValue = React.useMemo(
    () => ({
      error: null,
      midi: null,
      ready: false,
      selectedInput: null,
      selectedOutput: null,
      sysex: false,
      toggleSettings: () => setSettingsVisibe(current => !current),
    }),
    []
  );
  const [contextValue, setContextValue] = React.useState(defaultContextValue);

  const handleConnectionStateChanged = React.useCallback(e => {
    console.log(e.port.name, e.port.manufacturer, e.port.state);
  }, []);

  const initialize = React.useCallback(
    sysex => {
      setContextValue(defaultContextValue);
      return navigator
        .requestMIDIAccess({ sysex: sysex === true })
        .then(midi => {
          window.midi = midi;

          midi.onstatechange = handleConnectionStateChanged;

          setContextValue(ctx => {
            const newContext = {
              ...ctx,
              midi,
              ready: true,
              sysex: sysex === true,
            };

            // try to preserve previous input, if available
            var inputs = Array.from(midi.inputs.values()).filter(
              i => i.state === 'connected'
            );
            newContext.selectedInput =
              inputs.find(i => i.id === ctx.selectedInput) ||
              inputs.find(i => i.name.indexOf(defaultInputName) >= 0) ||
              inputs[0] ||
              null;

            // same for outputs
            var outputs = Array.from(midi.outputs.values()).filter(
              o => o.state === 'connected'
            );
            newContext.selectedOutput =
              outputs.find(o => o.id === ctx.selectedOutput) ||
              outputs.find(o => o.name.indexOf(defaultOutputName) >= 0) ||
              outputs[0] ||
              null;

            return newContext;
          });
        })
        .catch(ex =>
          setContextValue({ ...defaultContextValue, error: ex.message })
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
