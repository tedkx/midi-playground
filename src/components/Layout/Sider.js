import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { Sider: AntSider } = Layout;

const Sider = ({ collapsed, menuItems, onToggleCollapsed, selectedKey }) => (
  <AntSider trigger={null} collapsible collapsed={collapsed}>
    <div className="sider-top">
      {collapsed ? (
        <MenuUnfoldOutlined className="trigger" onClick={onToggleCollapsed} />
      ) : (
        <MenuFoldOutlined className="trigger" onClick={onToggleCollapsed} />
      )}
    </div>
    <Menu mode="inline" selectedKeys={[selectedKey]}>
      {menuItems.map(({ title, icon: Icon, items, to }, idx) =>
        items ? (
          <Menu.SubMenu key={`menu${idx}`} icon={<Icon />} title={title}>
            {items.map(({ title: subitemTitle, to: subitemTo }) => (
              <Menu.Item key={subitemTo}>
                <Link to={subitemTo}>{subitemTitle}</Link>
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item key={to} icon={<Icon />}>
            <Link to={to}>{title}</Link>
          </Menu.Item>
        )
      )}
    </Menu>
  </AntSider>
);

export default Sider;
