import React from 'react';
import MidiContext from './Context';
import SettingsModal from './SettingsModal';
import { MidiPortState } from 'lib/enums';
import { debounce } from 'lodash';

const preferredInputName = 'MODX-1';
const preferredOutputName = 'MODX-1';
const globalInputName = 'global';

const MidiContextProvider = ({ children }) => {
  const [settingsVisible, setSettingsVisibe] = React.useState(false);

  const ref = React.useRef({
    midi: null,
    pendingConnectionChanges: [],
    pendingConnectionTimeout: null,
    selectedInput: null,
    subscriptions: { [globalInputName]: [] },
  });

  // function to subscribe to midi input messages
  const subscribe = React.useCallback((callback, opts) => {
    const { ignoreMessages, inputName } = opts || {};

    const input = !inputName
      ? ref.current.selectedInput
      : inputName === '*'
      ? { name: globalInputName }
      : typeof inputName === 'string'
      ? Array.from(ref.current.midi.inputs.values()).find(
          inp => inp.name === inputName
        )
      : null;

    if (!input) return console.warn('Invalid midi input', inputName);

    const subscription = {
      callback,
      ignoreMessages: Array.isArray(ignoreMessages) ? ignoreMessages : null,
    };

    if (!ref.current.subscriptions[input.name])
      ref.current.subscriptions[input.name] = [];
    ref.current.subscriptions[input.name].push(subscription);

    // return unsubscriber function
    return () => {
      for (let i = 0; i < ref.current.subscriptions[input.name].length; i++)
        if (ref.current.subscriptions[input.name][i] === subscription)
          return (
            console.log('found subscription') ||
            ref.current.subscriptions[input.name].splice(i, 1)
          );
    };
  }, []);

  const defaultContextValue = React.useMemo(
    () => ({
      error: null,
      initialize: null,
      ready: false,
      selectedInput: null,
      selectedOutput: null,
      subscribe,
      sysex: false,
      toggleSettings: () => setSettingsVisibe(current => !current),
    }),
    []
  );

  const [contextValue, setContextValue] = React.useState(defaultContextValue);

  // Update ref when selected input changed
  React.useEffect(() => {
    if (contextValue?.selectedInput) {
      ref.current.selectedInput = contextValue.selectedInput;
      /// TODO: Change subscriptions accordingly
    }
  }, [contextValue?.selectedInput]);

  const getMidiMessageHandler = React.useCallback(() => {
    return ({ data, srcElement: input }) =>
      [
        ...(ref.current.subscriptions[input.name] || []),
        ...ref.current.subscriptions[globalInputName],
      ]
        .filter(
          ({ ignoreMessages }) =>
            !ignoreMessages || !ignoreMessages.includes(data[0])
        )
        .forEach(({ callback }) => callback(data, input));
  }, []);

  // add new connected inputs/outputs and discard disconnected from context
  const onConnectionStateChanged = React.useCallback(
    e => {
      console.log('pending changes', ref.current.pendingConnectionChanges);

      const inputs = Array.from(ref.current.midi.inputs.values()).filter(
        input => input.state === MidiPortState.Connected
      );
      const outputs = Array.from(ref.current.midi.outputs.values()).filter(
        input => input.state === MidiPortState.Connected
      );

      if (e.port.state === MidiPortState.Connected) {
        setContextValue(currentCtx => ({ ...currentCtx, inputs, outputs }));
      } else {
        setContextValue(currentCtx => {
          // go to next input/output, if disconnected port was selected
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

          if (
            newSelectedInput &&
            !ref.current.subscriptions[newSelectedInput.name]
          )
            ref.current.subscriptions[newSelectedInput.name] = [];

          // update input-less subscriptions
          const orphanedSubscriptions = ref.current.pendingConnectionChanges
            .filter(
              port =>
                port.type === 'input' &&
                port.connection === 'closed' &&
                port.state === 'disconnected'
            )
            .reduce(
              (arr, port) =>
                ref.current.subscriptions[port.name]
                  ? [...arr, ...ref.current.subscriptions[port.name]]
                  : arr,
              []
            );
          console.log(
            'orphaned subscriptions',
            ref.current.pendingConnectionChanges.filter(
              port =>
                port.connection === 'closed' && port.state === 'disconnected'
            ),
            '->',
            orphanedSubscriptions
          );

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

      ref.current.pendingConnectionChanges = [];
    },
    [setContextValue]
  );

  const handleConnectionStateChanged = React.useCallback(
    e => {
      if (e.port.connection === 'pending') return;

      ref.current.pendingConnectionChanges.push(e.port);

      clearTimeout(ref.current.pendingConnectionTimeout);
      ref.current.pendingConnectionTimeout = setTimeout(
        () => onConnectionStateChanged(e),
        100
      );
    },
    [onConnectionStateChanged]
  );

  const initialize = React.useCallback(
    sysex => {
      setContextValue(defaultContextValue);
      return navigator
        .requestMIDIAccess({ sysex: sysex === true })
        .then(midi => {
          ref.current.midi = midi;

          // wire-up midi/port events
          midi.onstatechange = handleConnectionStateChanged;

          const inputs = Array.from(midi.inputs.values()).filter(
            i => i.state === 'connected'
          );
          for (let input of inputs)
            input.onmidimessage = getMidiMessageHandler(input);

          setContextValue(ctx => {
            const outputs = Array.from(midi.outputs.values()).filter(
              o => o.state === 'connected'
            );

            const newContext = {
              ...ctx,
              inputs,
              outputs,
              ready: true,
              sysex: sysex === true,
              toggleSettings: () => setSettingsVisibe(current => !current),
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
