import React from 'react';
import { Form, Modal, Select } from 'antd';
import MidiContext from './Context';

const formatOption = inputOutput => ({
  disabled: inputOutput.state !== 'connected',
  label: inputOutput.name,
  value: inputOutput.id,
});

const SettingsModal = ({ contextValue, setContextValue, ...props }) => {
  const { visible } = props;
  const { midi, selectedInput, selectedOutput } = contextValue || {};

  const {
    inputOptions = [],
    outputOptions = [],
    initialValues = {},
  } = React.useMemo(
    () =>
      visible
        ? {
            inputOptions: Array.from(midi.inputs.values()).map(formatOption),
            outputOptions: Array.from(midi.outputs.values()).map(formatOption),
          }
        : {},
    [visible]
  );

  const handleInputSelect = React.useCallback(
    id =>
      setContextValue(ctx => ({ ...ctx, selectedInput: midi.inputs.get(id) })),
    [midi, setContextValue]
  );
  const handleOutputSelect = React.useCallback(
    id =>
      setContextValue(ctx => ({
        ...ctx,
        selectedOutput: midi.outputs.get(id),
      })),
    [midi, setContextValue]
  );

  return (
    <Modal destroyOnClose title="Settings" {...props}>
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Form.Item label="Input">
          <Select
            name="selectedInput"
            options={inputOptions}
            onSelect={handleInputSelect}
            value={selectedInput?.id || null}
          />
        </Form.Item>
        <Form.Item label="Output">
          <Select
            name="selectedOutput"
            options={outputOptions}
            onSelect={handleOutputSelect}
            value={selectedOutput?.id || null}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SettingsModal;
