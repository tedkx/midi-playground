import { DashboardOutlined, EyeOutlined } from '@ant-design/icons';

const getMenuItems = () => [
  { icon: DashboardOutlined, title: 'Dashboard', to: '/' },
  {
    icon: EyeOutlined,
    title: 'Altered Scale',
    to: '/altered',
  },
];

export { getMenuItems };
