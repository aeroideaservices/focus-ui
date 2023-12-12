import { IAuthParams } from '@/types/auth/auth';

import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Center, Grid, Paper, TextInput, Title, UnstyledButton } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDocumentTitle } from '@mantine/hooks';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

import { TITLE_AUTH } from '@/constants/titles';

import { AppDispatch } from '@/store';
import { fetchAuth, fetchingGetConfiguration, tokenSelector } from '@/store/slices/auth/auth';

const AuthPage: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const token = useSelector(tokenSelector);
  const fetching = useSelector(fetchingGetConfiguration);

  useDocumentTitle(TITLE_AUTH);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  });

  const data = {
    grant_type: process.env.GRANT_TYPE,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  };

  const handleSubmit = (formData: IAuthParams) => {
    dispatch(fetchAuth({ ...data, ...formData }));
  };

  return (
    <Grid gutter={0}>
      <Grid.Col
        span={6}
        sx={{
          backgroundImage: 'url(../images/auth.png)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      ></Grid.Col>
      <Grid.Col span={6}>
        <Center sx={{ minHeight: '100vh' }}>
          <Paper p={24} radius={8}>
            <form style={{ width: '300px' }} onSubmit={form.onSubmit(handleSubmit)}>
              <Title order={1} mb={32}>
                Войти в систему
              </Title>
              <TextInput placeholder="Логин" required mb={12} {...form.getInputProps('username')} />
              <TextInput
                type={opened ? 'text' : 'password'}
                placeholder="Пароль"
                required
                mb={40}
                {...form.getInputProps('password')}
                rightSection={
                  <UnstyledButton color={'gray'} onClick={() => setOpened(!opened)}>
                    {opened ? (
                      <IconEye size={20} color={'gray'} />
                    ) : (
                      <IconEyeOff size={20} color={'gray'} />
                    )}
                  </UnstyledButton>
                }
              />
              <Button fullWidth type={'submit'} disabled={fetching}>
                Войти
              </Button>
            </form>
          </Paper>
        </Center>
      </Grid.Col>
    </Grid>
  );
};

export default AuthPage;
