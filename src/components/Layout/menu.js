import { DashboardOutlined, EyeOutlined } from '@ant-design/icons';

const getMenuItems = () => [
  { icon: DashboardOutlined, title: 'Dashboard', to: '/' },
  {
    icon: EyeOutlined,
    //   items: [
    //     { title: t('create'), to: '/altered' },
    //     { title: t('list'), to: '/entities' },
    //   ],
    title: 'Altered',
    to: '/altered',
  },
];

export { getMenuItems };
