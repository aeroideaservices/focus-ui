import { OutputData } from '@editorjs/editorjs';

export const getJSONdata = (value: string): OutputData | undefined => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return undefined;
  }
};
