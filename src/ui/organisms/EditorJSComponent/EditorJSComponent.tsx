import { FC, useEffect, useRef, useState } from 'react';
import React from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { Box, createStyles, Input, InputWrapperProps } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

import { transliteration } from '@/utils/transliteration';

import { getJSONdata } from './utils/getJSONdata';
import { getTools } from './utils/getTools';
import { I18nDictionary } from './utils/i18n';
import { outputDataIsEmpty } from './utils/outputDataIsEmpty';

import styles from './EditorJSComponent.module.scss';

interface EditorJSComponentProps extends Omit<InputWrapperProps, 'children'> {
  useForm: UseFormReturnType<{
    fields: any;
  }>;
  formField: any;
  fieldName: string;
  name: string;
}

const useStyles = createStyles((theme) => ({
  editor: {
    width: '100%',
    minHeight: 320,
    padding: '16px 0 1px 50px',
    border:
      theme.colorScheme === 'dark'
        ? `1px solid ${theme.colors.gray[8]}`
        : `1px solid ${theme.colors.gray[4]}`,
    borderRadius: 4,
    marginBottom: 5,
    zIndex: 'auto',
  },
  error: {
    borderColor: `${theme.colors.red[6]}`,
  },
}));

const EditorJSComponent: FC<EditorJSComponentProps> = ({
  useForm,
  formField,
  fieldName,
  name,
  ...props
}) => {
  const { classes, cx } = useStyles();
  const ref = useRef<EditorJS | null>(null);
  const holder = `editorjs_${transliteration(name)}`;
  const formData = useForm.getInputProps(fieldName).value;
  const [savedData, setSavedData] = useState<OutputData | null>(
    getJSONdata(formData) as OutputData
  );
  const { extra, opts } = formField;

  const initializeEditor = () => {
    const editor = new EditorJS({
      i18n: { ...I18nDictionary, direction: 'ltr' },
      holder: holder,
      placeholder: 'Введите текст или вставьте ссылку',
      minHeight: 32,
      tools: {
        ...getTools(opts || extra, opts ? 'v1' : 'v2'),
      },
      data: getJSONdata(formData),
      onReady: () => {
        ref.current = editor;
      },
      onChange: (api) => {
        api.saver.save().then((outputData) => {
          if (outputDataIsEmpty(outputData)) {
            setSavedData(null);
          } else {
            setSavedData(outputData);
          }
        });
      },
    });
  };

  useEffect(() => {
    if (!ref.current) {
      initializeEditor();
    }

    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (savedData) {
      useForm.setFieldValue(fieldName, JSON.stringify(savedData));
    } else {
      useForm.setFieldValue(fieldName, '');
    }
  }, [savedData]);

  return (
    <Input.Wrapper {...props}>
      <Box
        id={props.id}
        className={cx(classes.editor, { [classes.error]: props.error }, styles.editorStyleFix)}
      >
        <div id={holder}></div>
      </Box>
    </Input.Wrapper>
  );
};

export default React.memo(EditorJSComponent);
