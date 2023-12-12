import { FC, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ActionIcon, Box, clsx, Collapse, createStyles } from '@mantine/core';
import { IconChevronUp, IconPlus } from '@tabler/icons-react';

import DropdownButtonItems from '../DropdownItemButtons/DropdownButtonItems';

import { AppDispatch } from '@/store';
import {
  fetchGetMenuItemsChildrenAction,
  selectDropAccept,
  selectTreeData,
  selectTreeIds,
  setAddMenuItemsModalOpened,
  setCurrentPath,
  setParentId,
  setTreeIds,
} from '@/store/slices/menu/menuItems';

interface IDroppableDropDown {
  item: any;
  itemPath?: any;
  index: any;
  onDragEndHandler: any;
  parentId?: any;
  path?: any;
}

interface IMonitor {
  isDragging: () => Boolean;
}

const useStyles = createStyles((theme) => ({
  base: {
    width: '100%',
    border:
      theme.colorScheme === 'dark' ? `1px solid ${theme.colors.gray[6]}` : '1px solid #E8ECF0',
    borderRadius: theme.colorScheme === 'dark' ? 2 : 4,
    padding: '10px 12px 12px 12px',
    cursor: 'pointer',
    display: 'flex',
  },
  dragged: {
    border:
      theme.colorScheme === 'dark'
        ? `1px solid ${theme.colors['jungle-mist'][7]}`
        : `1px solid ${theme.colors.blue[5]}`,
  },
  placeholderBase: {
    marginBottom: 4,
    marginTop: 8,
    borderRadius: 4,
    border: '1px solid transparent',
  },
  placeholderDragged: {
    border:
      theme.colorScheme === 'dark'
        ? `1px dashed ${theme.colors['jungle-mist'][7]}`
        : `1px dashed ${theme.colors.blue[5]}`,
  },
}));

const DroppableDropDown: FC<IDroppableDropDown> = ({
  item,
  index,
  onDragEndHandler,
  parentId,
  path,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const params = useParams();
  const treeIds = useSelector(selectTreeIds);
  const [opened, setOpened] = useState<boolean>(false);
  const dropAccept = useSelector(selectDropAccept);
  const treeData = useSelector(selectTreeData);
  const { classes } = useStyles();

  const ref = useRef(null);
  const ref2 = useRef(null);

  const [, drop] = useDrop({
    accept: dropAccept ? dropAccept : [],
    drop(hoverItem: any) {
      onDragEndHandler(hoverItem, index, path ? `${path}.${item.id}` : item.id, index);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: path ? `${path}.${item.id}` : item.id,
    item: { type: path ? `${path}.${item.id}` : item.id, id: item.data.id, dragIndex: index },
    collect: (monitor: IMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.3 : 1;

  drag(drop(ref));

  const handleOpen = (e: any) => {
    const { menuId } = params;
    const splittedPath = path ? path.split('.') : [];

    if (e?.target?.classList.value.includes('can')) {
      setOpened((prev) => !prev);

      if (!parentId && !treeIds.includes(item?.data?.id)) {
        dispatch(setTreeIds([...splittedPath, item?.data?.id]));
      }

      if (parentId && !treeIds.find((el: any) => el.includes(item.id))) {
        const branch = treeIds.find((el: any) => el.includes(parentId));

        dispatch(setTreeIds([...splittedPath, `${branch}.${item.id}`]));
      }

      treeIds.find((el: any) => el.includes(item?.data?.id));

      if (menuId)
        dispatch(
          fetchGetMenuItemsChildrenAction({
            id: menuId,
            oldTreeData: treeData,
            path: path ? `${path}.${item.id}` : item.id,
            params: { parentMenuItemId: item?.data?.id },
            itemId: item?.data?.id,
          })
        );
    }
  };

  const [, drop2] = useDrop({
    accept: dropAccept ? dropAccept : [],
    drop(hoverItem: any) {
      onDragEndHandler(
        hoverItem,
        index,
        path ? `${path}.${item.id}.new` : `${item.id}.new`,
        index,
        true
      );
    },
  });

  if (opened) drop2(ref2);

  return (
    <>
      <Box className={clsx(classes.placeholderBase, { [classes.placeholderDragged]: isDragging })}>
        <Box
          onClick={(e: any) => handleOpen(e)}
          sx={{
            opacity: opacity,
            '.mantine-Group-root': {
              marginLeft: 'auto',
            },
          }}
          ref={ref}
          className={clsx('can', classes.base, { [classes.dragged]: isDragging })}
        >
          <Box
            mr={12}
            sx={{
              transform: !opened ? 'rotate(180deg)' : '',
            }}
            className="can"
          >
            <IconChevronUp />
          </Box>

          <span className="can">
            <b className="can">{item?.data?.name} &nbsp;</b>
            {`${item?.data?.url}`}
          </span>
          <DropdownButtonItems item={item?.data} path={path} />
        </Box>

        <Box ml={40}>
          <Collapse in={opened} transitionDuration={100} transitionTimingFunction="linear">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'end',
                width: '100%',
                marginTop: '8px',
              }}
              id="new"
              ref={ref2}
            >
              <ActionIcon
                variant={'outline'}
                size={'lg'}
                color="gray.6"
                onClick={() => {
                  dispatch(setAddMenuItemsModalOpened(true));
                  dispatch(setParentId(item?.data?.id));
                  dispatch(setCurrentPath(path ? `${path}.${item.id}` : item.id));
                }}
              >
                <IconPlus />
              </ActionIcon>
            </Box>

            {item[item?.id] &&
              item[item?.id].map((itemInner: any, indexInner: any) => (
                <DroppableDropDown
                  item={itemInner}
                  index={indexInner}
                  key={itemInner.id}
                  parentId={item.id}
                  onDragEndHandler={onDragEndHandler}
                  path={path ? `${path}.${item.id}` : item.id}
                />
              ))}
          </Collapse>
        </Box>
      </Box>
    </>
  );
};

export default DroppableDropDown;
