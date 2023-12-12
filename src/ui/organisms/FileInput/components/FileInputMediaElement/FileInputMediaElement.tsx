import { ResourceType } from '@/types';

import { FC, useEffect, useMemo, useState } from 'react';
import {
  AspectRatio,
  Box,
  Flex,
  LoadingOverlay,
  Paper,
  PaperProps,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { isEmpty } from 'lodash';

import { ServiceCode } from '@/constants/services';

import { getFileInfo, getFolderInfo } from '../../utils/mediaRequests';
import FileInputFilePreview from '../FileInputFilePreview/FileInputFilePreview';
import FileInputFolderPreview from '../FileInputFolderPreview/FileInputFolderPreview';
import FileInputImagePreview from '../FileInputImagePreview/FileInputImagePreview';
import FileInputVideoPreview from '../FileInputVideoPreview/FileInputVideoPreview';

const VIDEO_EXTENSIONS = ['mov', 'webm', 'mp4', 'm4v'];

interface FileInputMediaElementProps extends PaperProps {
  resourceType: ResourceType;
  id: string;
  service: ServiceCode;
  name?: string;
  onPreselect?: (id: string) => void;
  onSelect?: (id: string, type: ResourceType) => void;
  previewUrl?: string;
  selected?: boolean;
  showInfo?: boolean;
  selectable?: boolean;
  aspect?: number;
}

const FileInputMediaElement: FC<FileInputMediaElementProps> = ({
  resourceType,
  id,
  name,
  previewUrl,
  service,
  onSelect,
  onPreselect,
  selected = false,
  showInfo = true,
  selectable = false,
  aspect = 16 / 9,
  ...props
}) => {
  const [preview, setPreview] = useState(previewUrl);
  const [loading, setLoading] = useState(false);
  const [fileName, setName] = useState(name);
  const [size, setSize] = useState<string | null>(null);
  const [fileType, setFileType] = useState('');
  const [ext, setExt] = useState('');
  const theme = useMantineTheme();

  const fetchFileInfo = async () => {
    setLoading(true);
    const file = await getFileInfo(service, id);
    if (isEmpty(file)) return;
    setPreview(file.url);
    setName(file.name);
    setExt(file.ext);
    setFileType(file.contentType);
    setSize(file.size);
    setLoading(false);
  };

  const fetchFolderInfo = async () => {
    setLoading(true);
    const folder = await getFolderInfo(service, id);
    if (isEmpty(folder) || !folder.size) return;
    setSize(folder.size);
    setLoading(false);
  };

  useEffect(() => {
    if (resourceType === ResourceType.FILE && (!previewUrl || !name)) fetchFileInfo();
    if (resourceType === ResourceType.FOLDER && !size) fetchFolderInfo();
  }, [id]);

  const previewComponent = useMemo(() => {
    if (resourceType === ResourceType.FOLDER) return <FileInputFolderPreview />;

    if (!preview) return null;

    if (VIDEO_EXTENSIONS.includes(ext))
      return <FileInputVideoPreview src={preview} name={fileName} />;

    if (fileType.split('/')[0] === 'image')
      return <FileInputImagePreview src={preview} name={fileName} />;

    return <FileInputFilePreview />;
  }, [ext, fileType]);

  const wrapperStyles = useMemo(() => {
    if (!selectable) return { overflow: 'hidden' };
    return {
      border: selected
        ? theme.colorScheme === 'dark'
          ? `2px solid ${theme.colors['jungle-mist'][7]}`
          : `2px solid ${theme.colors['science-blue'][9]}`
        : '2px solid transparent',
      borderRadius: 4,
      overflow: 'hidden',
    };
  }, [selected, selectable]);

  return (
    <Box
      onClick={() => onPreselect && onPreselect(id)}
      onDoubleClick={() => onSelect && onSelect(id, resourceType)}
    >
      <UnstyledButton
        display="block"
        w="100%"
        bg={theme.colors.red[1]}
        sx={wrapperStyles}
        style={{
          background: 'transparent',
        }}
      >
        <Paper {...props} sx={{ overflow: 'hidden' }}>
          <AspectRatio ratio={aspect} sx={{ position: 'relative' }}>
            <Flex
              justify="center"
              align="center"
              top={0}
              left={0}
              w="100%"
              h="100%"
              sx={{ overflow: 'hidden' }}
            >
              {previewComponent}
            </Flex>
            <LoadingOverlay
              overlayBlur={2}
              overlayColor={theme.colors.gray[0]}
              overlayOpacity={0.4}
              visible={loading}
            />
          </AspectRatio>
          {showInfo ? (
            <Box px="sm" py={4}>
              <Text
                size="sm"
                weight={500}
                truncate
                align="center"
                mt="0.25rem"
                title={`${fileName}.${ext}`}
              >
                {fileName}
              </Text>
              <Text size="sm" weight={400} c="dimmed" truncate align="center">
                &nbsp;{size}
              </Text>
            </Box>
          ) : null}
        </Paper>
      </UnstyledButton>
    </Box>
  );
};

export default FileInputMediaElement;
