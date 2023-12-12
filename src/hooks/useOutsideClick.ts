import { RefObject, useEffect } from 'react';

export const useOutsideClick = (
  ref: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  handler: (e: Event) => void
) => {
  const refsArr = Array.isArray(ref) ? ref : [ref];

  useEffect(() => {
    const listener = (event: Event) => {
      if (
        refsArr.every((item) => !item.current) ||
        refsArr.some((item) => item.current?.contains(event.target as HTMLElement))
      )
        return;

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [...refsArr, !!handler]);
};
