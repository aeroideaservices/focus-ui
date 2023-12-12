import { FC, useState } from 'react';
import { Flex, Modal, Title } from '@mantine/core';

interface FileInputImagePreviewProps {
  src: string;
  name?: string;
}

const FileInputImagePreview: FC<FileInputImagePreviewProps> = ({ src, name }) => {
  const [showImage, setShowImage] = useState(false);

  return (
    <>
      <img
        src={src}
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          width: '100%',
          height: '100%',
          cursor: 'zoom-in',
        }}
        onClick={(e) => {
          e.stopPropagation();
          setShowImage(true);
        }}
      />
      <Modal opened={showImage} onClose={() => setShowImage(false)} size="xl" p="md">
        {name && (
          <Title size="sm" lineClamp={1} mb="xs">
            {name}
          </Title>
        )}
        <Flex justify="center">
          <img
            src={src}
            style={{
              width: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
        </Flex>
      </Modal>
    </>
  );
};

export default FileInputImagePreview;
