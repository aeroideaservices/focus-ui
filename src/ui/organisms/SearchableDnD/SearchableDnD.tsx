import { FormFieldTypeEnum, TFormField, TSelectData } from '@/types/models_v2/models_v2';

import { FC, useEffect, useState } from 'react';
import React from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { Box, createStyles, MultiSelectProps } from '@mantine/core';
import { useId } from '@mantine/hooks';

import { getSelectData } from '../SearchableSelectV2/utils/getSelectData';
import { getSelectValue } from '../SearchableSelectV2/utils/getSelectValue';

import DraggableItem from './components/DraggableItem/DraggableItem';
import SearchComponent from './components/SearchComponent/SearchComponent';
import { getDnDValues } from './utils/getDnDValues';
import { sortDnDValues } from './utils/sortDnDValues';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    border:
      theme.colorScheme === 'dark'
        ? `1px solid ${theme.colors.gray[8]}`
        : `1px solid ${theme.colors.gray[4]}`,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  header: {
    padding: 12,
    width: '100%',
    display: 'flex',
    borderBottom:
      theme.colorScheme === 'dark'
        ? `1px solid ${theme.colors.gray[8]}`
        : `1px solid ${theme.colors.gray[4]}`,
  },
  headerText: {
    fontWeight: 700,
    fontSize: 14,
    flexGrow: 1,
    paddingLeft: 24,
  },
  num: {
    width: '7%',
    flexShrink: 0,
  },
  code: {
    width: '20%',
  },
  name: {
    width: '73%',
    paddingLeft: 18,
  },
  error: {
    borderColor: `${theme.colors.red[5]}`,
  },
}));

interface SearchableDnDProps extends Omit<MultiSelectProps, 'data'> {
  field: TFormField;
}

const SearchableDnD: FC<SearchableDnDProps> = ({ field, ...props }) => {
  const { classes, cx } = useStyles();
  const uuid = useId();
  const [selectData, setSelectData] = useState<TSelectData[]>([]);
  const [addDataToSearch, setAddDataToSearch] = useState<TSelectData[]>([]);

  const reorder = (list: TSelectData[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reorderSelectData = reorder(selectData, result.source.index, result.destination.index);

    setSelectData(reorderSelectData);
  };

  const handleDelete = (key: string) => {
    setSelectData(selectData.filter((item) => item.value !== key));
    setAddDataToSearch(selectData.filter((item) => item.value === key));
  };

  const handleAdd = (item: TSelectData) => {
    setSelectData([...selectData, item]);
  };

  useEffect(() => {
    if (props.onChange && props.value !== getDnDValues(selectData)) {
      props.onChange(getDnDValues(selectData));
    }
  }, [selectData]);

  useEffect(() => {
    if (props.value && field.type === FormFieldTypeEnum.SELECT) {
      getSelectValue(field, '').then((res) => {
        const initialSelectData = sortDnDValues(
          props.value,
          getSelectData(res, {
            valueID: 'value',
            labelID: 'label',
            codeID: 'code',
          })
        );

        setSelectData(initialSelectData);
      });
    }
  }, []);

  return (
    <>
      <SearchComponent
        field={field}
        cb={handleAdd}
        label={props.label}
        icon={props.icon}
        placeholder={props.placeholder}
        mb={12}
        selectedData={selectData}
        addDataToSearch={addDataToSearch}
        error={props.error}
      />

      <Box className={cx(classes.wrapper, { [classes.error]: props.error })} mb={props.mb}>
        <Box className={classes.header}>
          <div className={cx(classes.headerText, classes.num)}>№</div>
          <div className={cx(classes.headerText, classes.code)}>Код товара</div>
          <div className={cx(classes.headerText, classes.name)}>Наименование</div>
        </Box>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId={uuid}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  minHeight: 100,
                  paddingBottom: 20,
                }}
              >
                {selectData &&
                  selectData.map((item: TSelectData, index: number) => (
                    <Draggable
                      key={`${item.value}_${index}`}
                      draggableId={`${item.value}_${index}`}
                      index={index}
                    >
                      {(providedDraggable) => (
                        <DraggableItem
                          provided={providedDraggable}
                          item={item}
                          index={index}
                          deleteCallback={handleDelete}
                        />
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </>
  );
};

export default React.memo(SearchableDnD);
