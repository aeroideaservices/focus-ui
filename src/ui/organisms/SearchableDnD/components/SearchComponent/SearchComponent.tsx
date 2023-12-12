import { TFormField, TSelectData } from '@/types/models_v2/models_v2';

import { FC, useEffect, useState } from 'react';
import {
  ActionIcon,
  Button,
  Group,
  Loader,
  Popover,
  ScrollArea,
  Text,
  TextInput,
  TextInputProps,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import { fetching } from '@/ui/organisms/SearchableSelectV2/utils/fetching';
import { getSelectData } from '@/ui/organisms/SearchableSelectV2/utils/getSelectData';

interface SearchComponentProps extends TextInputProps {
  field: TFormField;
  selectedData: TSelectData[];
  addDataToSearch?: TSelectData[];
  cb?: (TSelectData: TSelectData) => void;
}

const SearchComponent: FC<SearchComponentProps> = ({
  field,
  selectedData,
  addDataToSearch,
  cb,
  ...props
}) => {
  const { extra } = field;
  const [opened, setOpened] = useState(false);
  const [searchFetching, setSearchFetching] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchData, setSearchData] = useState<TSelectData[]>([]);

  const uniqueData = (search: TSelectData[], selected: TSelectData[]) => {
    let tempSearchData = search;

    selected.forEach((item) => {
      tempSearchData = tempSearchData.filter((el) => el.value !== item.value);
    });

    return tempSearchData;
  };

  const handleSearch = async (value: string) => {
    if (value.length >= 3 && extra?.request) {
      setSearchFetching(true);

      await fetching(extra.request, value, {}, (res) => {
        const resData = getSelectData(res.items, {
          valueID: extra.identifier,
          labelID: extra.display && extra.display[1],
          codeID: extra.display && extra.display[0],
        });

        setSearchData(uniqueData(resData, selectedData));
      }).finally(() => setSearchFetching(false));
    }
  };

  const handleButtonClick = (item: TSelectData) => {
    setSearchData(uniqueData(searchData, [item]));

    if (cb) cb(item);
  };

  const handleOpen = () => {
    setOpened((ps) => !ps);
  };

  const handleInputClear = () => {
    setSearchValue('');
    setSearchData([]);
  };

  useEffect(() => {
    if (searchValue) handleSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (addDataToSearch && addDataToSearch?.length > 0) {
      setSearchData([...searchData, ...addDataToSearch]);
    }
  }, [addDataToSearch]);

  return (
    <Popover opened={opened} width="target" position="bottom" shadow="md">
      <Popover.Target>
        <TextInput
          onInput={(ev) => setSearchValue(ev.currentTarget.value)}
          {...props}
          icon={!searchFetching ? props.icon : <Loader size="sm" />}
          value={searchValue}
          onBlur={handleOpen}
          onFocus={handleOpen}
          onChange={undefined}
          rightSection={
            searchValue && (
              <ActionIcon color="gray" onClick={handleInputClear}>
                <IconX size={17} />
              </ActionIcon>
            )
          }
        />
      </Popover.Target>
      <Popover.Dropdown p={0}>
        {searchData && searchData.length === 0 && (
          <Text color="gray" size={'sm'} align="center" p={12}>
            Ничего не найдено
          </Text>
        )}
        {searchData && searchData.length > 0 && (
          <ScrollArea.Autosize mah={250} mx="auto">
            {searchData.map((item) => (
              <Button
                key={item.value}
                unstyled
                w={'100%'}
                onClick={() => handleButtonClick(item)}
                sx={(theme) => ({
                  cursor: 'pointer',
                  border: 0,
                  padding: 12,
                  backgroundColor: 'transparent',
                  borderBottom: `1px solid ${theme.colors.gray[2]}`,
                })}
              >
                <Group spacing={5} noWrap>
                  <Text size={'sm'} color="gray">
                    {item.code}
                  </Text>
                  <Text size={'sm'} truncate>
                    {item.label}
                  </Text>
                </Group>
              </Button>
            ))}
          </ScrollArea.Autosize>
        )}
      </Popover.Dropdown>
    </Popover>
  );
};

export default SearchComponent;
