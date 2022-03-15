import {
  AppstoreOutlined,
  CodeOutlined,
  DashboardOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const getMenuItems = () => [
  { icon: DashboardOutlined, title: 'Dashboard', to: '/' },
  {
    icon: EyeOutlined,
    title: 'Altered Scale',
    to: '/altered',
  },
  {
    icon: AppstoreOutlined,
    title: 'Sequencer',
    to: '/sequencer',
  },
  {
    icon: CodeOutlined,
    title: 'Tools',
    items: [{ title: 'Midi Message Viewer', to: '/tools/midi-message-viewer' }],
  },
];

export { getMenuItems };
