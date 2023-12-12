import { TTableConfig } from '@/types';

import { FC } from 'react';
import { Checkbox, Flex, Image, Text, ThemeIcon } from '@mantine/core';
import { IconPalette } from '@tabler/icons-react';

import { getTableTypeCol } from './getTableTypeCol';
import { includeRow } from './includeRow';

export const getTableRows = (
  config: TTableConfig[],
  elements: Record<string, any>[] | null,
  Buttons?: FC<any>,
  selectable?: boolean,
  selection?: Record<string, string>[],
  changeHandler?: (item: Record<string, string>) => void,
  sortableKeys?: string[]
) => {
  if (!elements) return null;

  return elements.map((element, i) => (
    <tr key={element.id || `${element.code}${i}`}>
      {selectable && selection && changeHandler && (
        <td>
          <Checkbox
            checked={includeRow(selection, element)}
            onChange={() => changeHandler(element)}
            transitionDuration={0}
          />
        </td>
      )}
      {config.map((el) =>
        Object.keys(element).map((key) => {
          if (el.code === key) {
            if (el.code === 'type') {
              return <td key={`${element.id}${el.code}`}>{getTableTypeCol(element)}</td>;
            } else if (el.code === 'photo' || el.code === 'video') {
              return (
                <td
                  key={`${element.id}${el.code}`}
                  style={{
                    paddingLeft: sortableKeys?.includes(key) ? 40 : undefined,
                    maxWidth: el.maxWidth !== undefined ? el.maxWidth : 256,
                    minWidth: el.minWidth !== undefined ? el.minWidth : 'auto',
                  }}
                >
                  <Flex justify={el.align}>
                    {element[key] !== null && (
                      <Image display="inline" src={element[key]} width={30} height={30} />
                    )}
                  </Flex>
                </td>
              );
            } else if (el.code === 'link') {
              return (
                <td
                  key={`${element.id}${el.code}`}
                  style={{
                    paddingLeft: sortableKeys?.includes(key) ? 40 : undefined,
                    maxWidth: el.maxWidth !== undefined ? el.maxWidth : 256,
                    minWidth: el.minWidth !== undefined ? el.minWidth : 'auto',
                  }}
                >
                  <Flex justify={el.align}>
                    <a href={element[key]} target="_blank" title={element[key]}>
                      Ссылка
                    </a>
                  </Flex>
                </td>
              );
            } else if (el.code === 'colors') {
              return (
                <td key={`${element.id}${el.code}`}>
                  {element[key] !== 'null' &&
                    element[key].split(',').map((item: string) => (
                      <ThemeIcon
                        key={item}
                        color={item}
                        size={'sm'}
                        variant="filled"
                        mr={3}
                        radius={0}
                        sx={(theme) => ({ borderColor: theme.colors.gray[3] })}
                      >
                        <IconPalette size={'1rem'} color={item} />
                      </ThemeIcon>
                    ))}
                </td>
              );
            } else {
              if (el.trimming === false) {
                return (
                  <td
                    key={`${element.id}${el.code}`}
                    style={{
                      paddingLeft: sortableKeys?.includes(key) ? 40 : undefined,
                      maxWidth: el.maxWidth !== undefined ? el.maxWidth : 256,
                      minWidth: el.minWidth !== undefined ? el.minWidth : 'auto',
                    }}
                  >
                    <Flex justify={el.align} sx={{ whiteSpace: 'nowrap' }}>
                      {element[key]}
                    </Flex>
                  </td>
                );
              }
              return (
                <td
                  key={`${element.id}${el.code}`}
                  style={{
                    paddingLeft: sortableKeys?.includes(key) ? 40 : undefined,
                    maxWidth: el.maxWidth !== undefined ? el.maxWidth : 256,
                    minWidth: el.minWidth !== undefined ? el.minWidth : 'auto',
                  }}
                >
                  <Flex justify={el.align}>
                    <Text lineClamp={1}>{element[key] !== 'null' ? element[key] : ''}</Text>
                  </Flex>
                </td>
              );
            }
          }
          return null;
        })
      )}
      {Buttons && (
        <td>
          <Buttons {...element} />
        </td>
      )}
    </tr>
  ));
};
