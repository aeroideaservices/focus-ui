import { NotificationProps, showNotification } from '@mantine/notifications';

type NotifyType = {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'default' | 'dark';
  params?: NotificationProps;
};

export default function notify({ message, type = 'default', params }: NotifyType) {
  const config: NotificationProps = {
    autoClose: 5000,
    message,
    ...params,
  };

  switch (type) {
    case 'info':
      return showNotification({ ...config, color: 'blue' });
    case 'success':
      return showNotification({ ...config, color: 'green' });
    case 'warning':
      return showNotification({ ...config, color: 'blue' });
    case 'error':
      return showNotification({ ...config, color: 'red' });
    case 'dark':
      return showNotification({ ...config, color: 'black' });
    default:
      return showNotification({ ...config });
  }
}
