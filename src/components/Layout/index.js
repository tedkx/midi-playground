import React from 'react';
import { Layout as AntLayout } from 'antd';
import { useLocation } from 'react-router-dom';
import { getMenuItems } from './menu';
import Sider from './Sider';
import Header from './Header';

const { Content } = AntLayout;

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const toggleCollapsed = React.useCallback(() => {
    setCollapsed(current => !current);
  }, [setCollapsed]);

  const { pathname } = useLocation();

  const selectedKey = React.useMemo(
    () => pathname.split('?')[0] || '',
    [pathname]
  );

  const menuItems = React.useMemo(() => getMenuItems(), []);

  return (
    <AntLayout>
      <Sider
        collapsed={collapsed}
        selectedKey={selectedKey}
        menuItems={menuItems}
        onToggleCollapsed={toggleCollapsed}
      />
      <AntLayout className="site-layout">
        <Header />
        <Content className="content-wrap">{children}</Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
