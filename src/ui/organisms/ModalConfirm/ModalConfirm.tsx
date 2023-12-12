import { FC } from 'react';
import { Button, Group, LoadingOverlay, Modal, ModalProps, Text, Title } from '@mantine/core';

interface IModalConfirm extends ModalProps {
  title: string;
  text: string;
  confirmHandler: () => void;
  blocked?: boolean;
}

const ModalConfirm: FC<IModalConfirm> = ({
  title,
  text,
  confirmHandler,
  blocked = false,
  ...props
}) => {
  return (
    <Modal
      centered
      size={'xs'}
      styles={{
        header: {
          marginBottom: 0,
        },
      }}
      {...props}
      title=""
    >
      <Title align="center" order={3} mb={20}>
        {title}
      </Title>
      <Text size="xs" align="center" mb={30}>
        {text}
      </Text>

      <Group position={'center'} grow>
        <Button onClick={confirmHandler} disabled={blocked}>
          Да
        </Button>
        <Button variant={'outline'} color="red" onClick={props.onClose} disabled={blocked}>
          Нет
        </Button>
      </Group>
      <LoadingOverlay visible={blocked} />
    </Modal>
  );
};

export default ModalConfirm;
