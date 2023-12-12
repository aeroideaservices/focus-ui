import { createContext } from 'react';

interface IMediaContext {
  onReload: () => void;
}

export const MediaContext = createContext<IMediaContext>({ onReload: () => null });
