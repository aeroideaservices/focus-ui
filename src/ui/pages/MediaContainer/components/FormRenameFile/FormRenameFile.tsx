import { FC, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Group, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';

import { ADD_FOLDER_FORM } from '@/constants/validationSchemas';

import { MediaContext } from '../../utils/mediaContext';

import { AppDispatch } from '@/store';
import { fetchRenameFile, selectCurrentFile } from '@/store/slices/media/mediaFiles';
import { selectCurrentService } from '@/store/slices/service/service';

const FormRenameFile: FC = () => {
  const { onReload } = useContext(MediaContext);
  const dispatch: AppDispatch = useDispatch();

  const currentFile = useSelector(selectCurrentFile);
  const service = useSelector(selectCurrentService);

  const form = useForm({
    validate: yupResolver(ADD_FOLDER_FORM),
    initialValues: {
      name: currentFile?.name || '',
      id: currentFile?.id || '',
    },
  });

  const submitHandler = async (values: { id: string; name: string }) => {
    if (service) {
      await dispatch(
        fetchRenameFile({
          values: values,
        })
      );
    }
    onReload();
  };

  return (
    <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
      <TextInput
        placeholder="Введите название"
        label="Название"
        required
        mb={24}
        {...form.getInputProps('name')}
      />

      <Group position="right">
        <Button type={'submit'}>Сохранить</Button>
      </Group>
    </form>
  );
};

export default FormRenameFile;
