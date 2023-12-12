export const isImage = (str: string): boolean => {
  const exts = ['jpg', 'jpeg', 'png'];

  if (str.split('/').length > 1) {
    if (str.split('/')[0] === 'image') return true;
  } else {
    if (exts.indexOf(str) != -1) return true;
  }

  return false;
};
