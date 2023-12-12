import { FC, useEffect, useState } from 'react';
import { ActionIcon, Box, ColorInput, ColorInputProps, Group } from '@mantine/core';
import { useCounter } from '@mantine/hooks';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { debounce } from 'lodash';

interface ColorsInputProps extends Omit<ColorInputProps, 'value' | 'onChange'> {
  id: string;
  onChange: (colors: string[]) => void;
  value?: string[];
}

const ColorsInput: FC<ColorsInputProps> = ({ id, onChange, ...props }) => {
  const [count, handlersCount] = useCounter(0);
  const [currentId, setCurrentId] = useState<string>('');
  const [inputState, setInputState] = useState<
    { id: string; el: (key: React.Key) => React.JSX.Element }[]
  >([]);

  const handlerChangeInput = () => {
    const inputs = document.getElementById(id)?.getElementsByTagName('input');
    let values: string[] = [];

    if (inputs) {
      const arr = Array.from(inputs);

      arr.forEach((item) => {
        if (item.value && item.value.length > 0) {
          values.push(item.value);
        }
      });
    }

    if (onChange) onChange(values);
  };

  const getColorInput = (identificator: string, color?: string) => {
    return {
      id: identificator,
      el: (key: React.Key) => (
        <Group key={key} noWrap align="flex-end">
          <ColorInput
            mb={12}
            placeholder={props.placeholder}
            w={'100%'}
            defaultValue={color}
            onChange={debounce(handlerChangeInput, 300)}
          />
          <ActionIcon
            variant="outline"
            size={36}
            mb={12}
            color="gray.5"
            onClick={() => setCurrentId(identificator)}
          >
            <IconMinus />
          </ActionIcon>
        </Group>
      ),
    };
  };

  const addInput = (index: number, value?: string) => {
    setInputState((prev) => [...prev, getColorInput(`colorInput_${id}_${index}`, value)]);
    handlersCount.increment();
  };

  useEffect(() => {
    if (currentId && currentId.length > 0) {
      setInputState([...inputState.filter((item) => item.id !== currentId)]);
    }
  }, [currentId]);

  useEffect(() => {
    handlerChangeInput();
  }, [inputState]);

  useEffect(() => {
    if (props.value && props.value.length > 1) {
      props.value.slice(1).map((el, i) => addInput(i, el));
    }
  }, []);

  return (
    <Box mb={props.mb} id={id}>
      <Group noWrap align="flex-end">
        <ColorInput
          {...props}
          mb={12}
          w={'100%'}
          defaultValue={props.value ? props.value[0] : undefined}
          value={undefined}
          onChange={debounce(handlerChangeInput, 300)}
        />
        <ActionIcon
          variant="outline"
          size={36}
          mb={12}
          color="gray.5"
          onClick={() => addInput(count)}
        >
          <IconPlus />
        </ActionIcon>
      </Group>

      {inputState.map((input) => input.el(input.id))}
    </Box>
  );
};

export default ColorsInput;
