import { FC } from 'react';
import loadable from '@loadable/component';
import { IconCircle, IconLoader } from '@tabler/icons-react';

const AsyncIcon = loadable(() => import(`@tabler/icons-react`), {
  resolveComponent: (components: any, props: Record<string, string>) => components[props.name],
  fallback: <IconLoader />,
});

interface DynamicIconProps {
  name: string;
}

const DynamicIcon: FC<DynamicIconProps> = ({ name }) => {
  if (name.length > 0 && name !== '') {
    return <AsyncIcon name={name} />;
  } else {
    return <IconCircle />;
  }
};

export default DynamicIcon;
