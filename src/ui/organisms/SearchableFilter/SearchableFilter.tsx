import { TAny, TFormField, TSelectData } from '@/types/models_v2/models_v2';

import { FC, useEffect, useState } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Loader,
  Popover,
  ScrollArea,
  Text,
  TextInput,
  TextInputProps,
} from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import { isArray } from 'lodash';

import { fetching } from '../SearchableSelectV2/utils/fetching';
import { getSelectData } from '../SearchableSelectV2/utils/getSelectData';

interface SearchableFilterProps extends TextInputProps {
  field: TFormField;
  cb?: (TSelectData: string[]) => void;
}

const transformValue = (value: TAny | undefined): string[] => {
  if (value === undefined) return [];

  const result: string[] = [];

  if (isArray(value)) {
    value.forEach((el) => {
      result.push(String(el));
    });
  } else {
    result.push(String(value));
  }

  return result;
};

const SearchableFilter: FC<SearchableFilterProps> = ({ field, cb, ...props }) => {
  const { extra } = field;
  const [opened, setOpened] = useState<boolean>(false);
  const ref = useClickOutside(() => setOpened(false));
  const [searchFetching, setSearchFetching] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchData, setSearchData] = useState<TSelectData[]>([]);
  const [selectedTempData, setSelectedTempData] = useState<string[]>(transformValue(field.value));
  const [selectedData, setSelectedData] = useState<string[]>(transformValue(field.value));

  const handleSearch = async (value: string) => {
    if (value.length >= 3 && extra?.request) {
      setSearchFetching(true);

      await fetching(extra.request, value, {}, (res) =>
        setSearchData(
          getSelectData(res.items, {
            filters: true,
          })
        )
      ).finally(() => setSearchFetching(false));
    } else if (value.length < 3) {
      setSearchData([]);
    }
  };

  const handleOpen = () => {
    setOpened((ps) => !ps);
  };

  const handleApply = () => {
    if (cb) cb(selectedTempData);

    handleOpen();
  };

  const handleClear = () => {
    setSelectedData([]);
    setSelectedTempData([]);
    if (!(extra && extra.selectData)) setSearchData([]);
    setSearchValue('');

    if (cb) cb([]);
  };

  useEffect(() => {
    if (field.value && extra && extra.request) {
      setSearchFetching(true);
      fetching(
        extra.request,
        isArray(field.value) ? String(field.value[0]).slice(1, 3) : String(field.value).slice(1, 3)
      )
        .then((res) => {
          setSearchData(
            getSelectData(res.data.items, {
              filters: true,
            })
          );
        })
        .finally(() => setSearchFetching(false));
    } else if (extra && extra.selectData) {
      setSearchData(extra.selectData);
    }
  }, []);

  useEffect(() => {
    setSelectedData(transformValue(field.value));
    setSelectedTempData(transformValue(field.value));
  }, [field.value]);

  useEffect(() => {
    if (searchValue) handleSearch(searchValue);
  }, [searchValue]);

  return (
    <Popover opened={opened} width="target" position="bottom" shadow="md">
      <Popover.Target>
        <TextInput
          onInput={(ev) => setSearchValue(ev.currentTarget.value)}
          {...props}
          value={searchValue}
          onFocus={handleOpen}
          onChange={undefined}
          icon={
            searchFetching ? (
              <Loader size="sm" />
            ) : selectedData.length > 0 ? (
              <Box
                sx={(theme) => ({
                  backgroundColor: theme.colors.blue[5],
                  color: theme.colors.gray[1],
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                })}
              >
                <Box fz={11} fw={700} lh={'22px'}>
                  {selectedData.length}
                </Box>
              </Box>
            ) : (
              props.icon
            )
          }
          rightSection={
            (searchValue.length > 0 || selectedData.length > 0) && (
              <ActionIcon color="gray" onClick={handleClear}>
                <IconX size={17} />
              </ActionIcon>
            )
          }
        />
      </Popover.Target>

      <Popover.Dropdown>
        <Box ref={ref}>
          {searchData && searchData.length === 0 && (
            <Text color="gray" size={'sm'} align="center">
              Ничего не найдено
            </Text>
          )}

          {searchData && searchData.length > 0 && (
            <>
              <ScrollArea.Autosize offsetScrollbars mah={250} mx="auto">
                <Checkbox.Group w={'100%'} value={selectedTempData} onChange={setSelectedTempData}>
                  {searchData.map((item, index) => (
                    <div key={item.value}>
                      <Checkbox w={'100%'} value={String(item.value)} label={item.label} />
                      {searchData.length - index !== 1 && (
                        <Divider
                          sx={(theme) => ({
                            margin: '12px 0',
                            borderTopColor: theme.colors.gray[2],
                          })}
                        />
                      )}
                    </div>
                  ))}
                </Checkbox.Group>
              </ScrollArea.Autosize>

              <Divider
                sx={(theme) => ({
                  margin: '0px -12px 12px',
                  borderTopColor: theme.colors.gray[2],
                })}
              />
              <Group grow>
                <Button size="xs" color="gray" variant="light" onClick={handleOpen}>
                  Отменить
                </Button>
                <Button size="xs" onClick={handleApply}>
                  Применить
                </Button>
              </Group>
            </>
          )}
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
};

export default SearchableFilter;
