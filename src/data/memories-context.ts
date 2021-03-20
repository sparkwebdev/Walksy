import React from 'react';

import { Photo } from '../components/ImagePickerNew';

export interface Memory {
  id: string;
  imagePath: string;
  title: string;
  base64Url: string;
}

const MemoriesContext = React.createContext<{
  memories: Memory[];
  addMemory: (photo: Photo, title: string) => void;
  initContext: () => void;
}>({
  memories: [],
  addMemory: () => {},
  initContext: () => {}
});

export default MemoriesContext;
