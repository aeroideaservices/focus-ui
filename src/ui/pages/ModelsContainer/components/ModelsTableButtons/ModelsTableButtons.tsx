import { TModel } from '@/types';

import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ActionIcon, Group } from '@mantine/core';
import { IconAlignRight } from '@tabler/icons-react';

const ModelsTableButtons: FC<TModel> = ({ ...props }) => {
  return (
    <Group position={'right'}>
      <ActionIcon title="Элементы модели" component={Link} to={`${props.code}`}>
        <IconAlignRight size={20} color="gray" />
      </ActionIcon>
    </Group>
  );
};

export default ModelsTableButtons;
