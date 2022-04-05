import React from 'react';
import { Button, Form, Modal, Select } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const formatOption = inputOutput => ({
  disabled: inputOutput.state !== 'connected',
  label: inputOutput.name,
  value: inputOutput.id,
});

const SettingsModal = ({ contextValue, setContextValue, ...props }) => {
  const { visible } = props;
  const { initialize, inputs, outputs, selectedInput, selectedOutput } =
    contextValue || {};

  const { inputOptions = [], outputOptions = [] } = React.useMemo(
    () =>
      visible && inputs && outputs
        ? {
            inputOptions: inputs.map(formatOption),
            outputOptions: outputs.map(formatOption),
          }
        : {},
    [inputs, outputs, visible]
  );

  const handleInputSelect = React.useCallback(
    id =>
      setContextValue(ctx => ({
        ...ctx,
        selectedInput: inputs.find(inp => inp.id === id),
      })),
    [inputs, setContextValue]
  );
  const handleOutputSelect = React.useCallback(
    id =>
      setContextValue(ctx => ({
        ...ctx,
        selectedOutput: outputs.find(output => output.id === id),
      })),
    [outputs, setContextValue]
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
        <div style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={initialize}>
            Re-Initialize Midi <ReloadOutlined />
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default SettingsModal;
