import { TFormBuilderRequest, TFormField } from '@/types';

import { FC, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Box, createStyles, MultiSelectProps } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

import SearchableSelect from '../SearchableSelect/SearchableSelect';
import { MultiSelectDataProps } from '../SearchableSelect/utils/getSearchData';

import DraggableItem from './components/DraggableItem/DraggableItem';

const useStyles = createStyles((theme) => ({
  wrapper: {
    border:
      theme.colorScheme === 'dark'
        ? `1px solid ${theme.colors.gray[8]}`
        : `1px solid ${theme.colors.gray[4]}`,
    borderRadius: 2,
    width: '100%',
    marginBottom: 12,
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
  code: {
    width: '20%',
  },
  name: {
    width: '80%',
    paddingLeft: 18,
  },
}));

interface SearchableSelectDnDProps<T> extends Omit<MultiSelectProps, 'data'> {
  formField: TFormField<{ request: T }>;
  inputProps?: Record<string, any>;
}

const SearchableSelectDnD: FC<SearchableSelectDnDProps<TFormBuilderRequest>> = ({
  formField,
  inputProps,
  ...props
}) => {
  const { classes, cx } = useStyles();
  const [selectData, setSelectData] = useState<MultiSelectDataProps[]>([]);

  const reorder = (list: MultiSelectDataProps[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderSelectData = reorder(selectData, result.source.index, result.destination.index);

    setSelectData(reorderSelectData);
  };

  const handleDelete = (key: string) => {
    setSelectData(selectData.filter((item) => item.value !== key));
  };

  const getValues = (data: MultiSelectDataProps[]): string[] => {
    const result: string[] = [];

    data.map((item) => result.push(item.value));

    return result;
  };

  useEffect(() => {
    if (props.value && typeof props.value === 'string') {
      const values = props.value as string;
      const tempValuesArr = values.split(',');
      const result: MultiSelectDataProps[] = [];

      tempValuesArr.map((value) =>
        result.push({
          value,
          label: value,
          code: '',
        })
      );

      setSelectData(result);
    }
  }, []);

  useEffect(() => {
    if (inputProps) inputProps.onChange(getValues(selectData).join(','));
  }, [selectData]);

  return (
    <>
      <SearchableSelect
        mb={12}
        formField={formField}
        selectedCallback={setSelectData}
        data={selectData}
        initialValue={getValues(selectData)}
        rightSection={<IconSearch size={18} color={'gray'} />}
        placeholder="Введите артикул или название товара"
        styles={{
          rightSection: { pointerEvents: 'none' },
          searchInput: {
            position: 'relative',
            backgroundColor: 'transparent',
            zIndex: 2,
            '&:focus': {
              backgroundColor: 'white',
            },
          },
          value: { display: 'none' },
          values: {
            position: 'relative',
            pointerEvents: 'none',
            '&::before': {
              position: 'absolute',
              left: 6,
              pointerEvents: 'none',
              color: 'gray',
              zIndex: 1,
            },
          },
        }}
        {...props}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Box className={classes.wrapper}>
          <Box className={classes.header}>
            <div className={cx(classes.headerText, classes.code)}>Код товара</div>
            <div className={cx(classes.headerText, classes.name)}>Наименование</div>
          </Box>

          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ minHeight: 100, paddingBottom: 20 }}
              >
                {selectData &&
                  selectData.map((item, innerIndex: number) => (
                    <Draggable key={item.value} draggableId={item.value} index={innerIndex}>
                      {(providedDraggable) => (
                        <DraggableItem
                          provided={providedDraggable}
                          item={item}
                          deleteCallback={handleDelete}
                        />
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Box>
      </DragDropContext>
    </>
  );
};

export default SearchableSelectDnD;
