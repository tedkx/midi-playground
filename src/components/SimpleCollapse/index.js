import React from 'react';
import { bool } from 'prop-types';
import { Collapse } from 'antd';

const key = '1';

const SimpleCollapse = props => {
  const { children, className, in: inProp, style } = props;

  const activeKey = React.useMemo(
    () => (Boolean(inProp) ? key : null),
    [inProp]
  );

  return (
    <div className={`simpleCollapse ${className}`} style={style}>
      <Collapse bordered={false} activeKey={activeKey}>
        <Collapse.Panel header={key} key={key}>
          {children}
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

SimpleCollapse.propTypes = {
  in: bool,
};

export default SimpleCollapse;
