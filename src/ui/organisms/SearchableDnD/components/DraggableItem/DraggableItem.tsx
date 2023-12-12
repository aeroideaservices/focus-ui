import { TSelectData } from '@/types/models_v2/models_v2';

import { FC } from 'react';
import { DraggableProvided } from '@hello-pangea/dnd';
import { ActionIcon, Box, createStyles } from '@mantine/core';
import { IconGripVertical, IconX } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 8,
    backgroundColor: 'white',
  },
  text: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    padding: '0 10px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  num: {
    width: '7%',
    color: `${theme.colors.gray[6]}`,
    flexShrink: 0,
  },
  code: {
    width: '20%',
  },
  name: {
    width: '73%',
  },
  icon: {
    flexShrink: 0,
  },
}));

interface DraggableItemProps {
  provided: DraggableProvided;
  item: TSelectData;
  index: number;
  deleteCallback: (key: string) => void;
}

const DraggableItem: FC<DraggableItemProps> = ({ provided, item, index, deleteCallback }) => {
  const { classes, cx } = useStyles();

  const handleDeleteItem = () => {
    deleteCallback(item.value);
  };

  return (
    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
      <Box className={classes.item}>
        <IconGripVertical size={18} color={'gray'} className={classes.icon} />
        <span className={cx(classes.text, classes.num)}>{index + 1}</span>
        <span className={cx(classes.text, classes.code)}>{item.code}</span>
        <span className={cx(classes.text, classes.name)}>{item.label}</span>

        <ActionIcon onClick={handleDeleteItem} size={18}>
          <IconX size={18} />
        </ActionIcon>
      </Box>
    </div>
  );
};

export default DraggableItem;
