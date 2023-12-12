import { FC, useEffect } from 'react';
import { TextInput, TextInputProps } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';

interface ISearchInput extends TextInputProps {
  searchAction: (query: string) => void;
  placeholder?: string;
}

const DEFAULT_PLACEHOLDER = 'Начните вводить ID, название или код';

const SearchInput: FC<ISearchInput> = ({
  searchAction,
  placeholder = DEFAULT_PLACEHOLDER,
  ...props
}) => {
  const [query, setQuery] = useDebouncedState('', 400);

  useEffect(() => {
    searchAction(query);
  }, [query]);

  return (
    <TextInput
      icon={<IconSearch width={20} height={20} />}
      onChange={(e) => setQuery(e.currentTarget.value)}
      placeholder={placeholder}
      className={'searchInput'}
      {...props}
    />
  );
};

export default SearchInput;
