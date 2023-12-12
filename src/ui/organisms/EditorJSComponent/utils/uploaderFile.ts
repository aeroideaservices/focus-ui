import { api } from '@/api';

const uploaderFile = async (file: File, url: string) => {
  const timestamp = Date.now();

  const renameFile = (originalFile: File, newName: string) => {
    return new File([originalFile], newName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });
  };

  const fileToUploader = renameFile(
    file,
    `${file.name.split('.')[0]}_${timestamp}.${file.name.split('.')[1]}`
  );

  const response = await api.post(
    url,
    { file: fileToUploader },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  if (response) {
    return response.data;
  }

  return null;
};

export default uploaderFile;
