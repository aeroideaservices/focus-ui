import { FC, useState } from 'react';
import { Box, Flex, Modal, Title, useMantineTheme } from '@mantine/core';
import { IconPlayerPlay } from '@tabler/icons-react';

interface FileInputVideoPreviewProps {
  src: string;
  name?: string;
  w?: string;
  h?: string;
}

const FileInputVideoPreview: FC<FileInputVideoPreviewProps> = ({ src, name, w, h }) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const { colors } = useMantineTheme();

  return (
    <>
      <Flex
        {...{ w, h }}
        justify="center"
        align="center"
        onClick={(e) => {
          e.stopPropagation();
          setShowPlayer(true);
        }}
      >
        <Box
          sx={{
            borderRadius: '99999px',
            backgroundColor: colors.gray[5],
            fontSize: 0,
            cursor: 'zoom-in',
          }}
          p="md"
        >
          <IconPlayerPlay color={colors.gray[0]} />
        </Box>
      </Flex>
      <Modal opened={showPlayer} onClose={() => setShowPlayer(false)} size="xl" p="md">
        {name && (
          <Title size="sm" lineClamp={1} mb="xs">
            {name}
          </Title>
        )}
        <video playsInline width="100%" src={src} controls autoPlay />
      </Modal>
    </>
  );
};

export default FileInputVideoPreview;
