import { makeSVGNode } from './makeSVGNode';

export const iconImage = () => {
  const icon = makeSVGNode('svg', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    viewBox: '0 0 24 24',
  });
  const iconPath1 = makeSVGNode('path', {
    d: 'M15 8h.01M12.5 21H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6.5',
  });
  const iconPath2 = makeSVGNode('path', { d: 'm3 16 5-5c.928-.893 2.072-.893 3 0l4 4' });
  const iconPath3 = makeSVGNode('path', {
    d: 'm14 14 1-1c.653-.629 1.413-.815 2.13-.559M19 16v6M22 19l-3 3-3-3',
  });

  icon.appendChild(iconPath1);
  icon.appendChild(iconPath2);
  icon.appendChild(iconPath3);

  return icon;
};

export const iconPencil = () => {
  const icon = makeSVGNode('svg', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    viewBox: '0 0 24 24',
  });

  const iconPath = makeSVGNode('path', {
    d: 'M4 20h4L18.5 9.5a1.5 1.5 0 0 0-4-4L4 16v4M13.5 6.5l4 4',
  });

  icon.appendChild(iconPath);

  return icon;
};

export const iconTrash = () => {
  const icon = makeSVGNode('svg', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    viewBox: '0 0 24 24',
  });

  const iconPath = makeSVGNode('path', {
    d: 'M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3',
  });

  icon.appendChild(iconPath);

  return icon;
};

export const iconPhotoDown = () => {
  const icon = makeSVGNode('svg', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    viewBox: '0 0 24 24',
  });

  const iconPath1 = makeSVGNode('path', { d: 'M15 8h.01' });
  const iconPath2 = makeSVGNode('path', {
    d: 'M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5',
  });
  const iconPath3 = makeSVGNode('path', { d: 'M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4' });
  const iconPath4 = makeSVGNode('path', { d: 'M14 14l1 -1c.653 -.629 1.413 -.815 2.13 -.559' });
  const iconPath5 = makeSVGNode('path', { d: 'M19 16v6' });
  const iconPath6 = makeSVGNode('path', { d: 'M22 19l-3 3l-3 -3' });

  icon.appendChild(iconPath1);
  icon.appendChild(iconPath2);
  icon.appendChild(iconPath3);
  icon.appendChild(iconPath4);
  icon.appendChild(iconPath5);
  icon.appendChild(iconPath6);

  return icon;
};

export const iconRefresh = () => {
  const icon = makeSVGNode('svg', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    viewBox: '0 0 24 24',
  });

  const iconPath = makeSVGNode('path', {
    d: 'M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4',
  });

  icon.appendChild(iconPath);

  return icon;
};

export const iconCross = () => {
  const icon = makeSVGNode('svg', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    viewBox: '0 0 24 24',
  });

  const iconPath = makeSVGNode('path', {
    d: 'M18 6 6 18M6 6l12 12',
  });

  icon.appendChild(iconPath);

  return icon;
};

export const iconLetterR = () => {
  const icon = makeSVGNode('svg', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    viewBox: '0 0 24 24',
  });

  const iconPath = makeSVGNode('path', {
    d: 'M7 20V4h5.5a4 4 0 0 1 0 9H7M12 13l5 7',
  });

  icon.appendChild(iconPath);

  return icon;
};

export const iconLetterL = () => {
  const icon = makeSVGNode('svg', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    viewBox: '0 0 24 24',
  });

  const iconPath = makeSVGNode('path', {
    d: 'M7 4v16h10',
  });

  icon.appendChild(iconPath);

  return icon;
};

export const iconChecked = () => {
  const icon = makeSVGNode('svg', {
    fill: 'none',
    viewBox: '0 0 10 7',
  });

  const iconPath = makeSVGNode('path', {
    d: 'M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z',
    fill: 'currentColor',
    'fill-rule': 'evenodd',
    'clip-rule': 'evenodd',
  });

  icon.appendChild(iconPath);

  return icon;
};

export const iconPhoto =
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon icon-tabler icon-tabler-photo" viewBox="0 0 24 24"><path d="M15 8h.01M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6z"/><path d="m3 16 5-5c.928-.893 2.072-.893 3 0l5 5"/><path d="m14 14 1-1c.928-.893 2.072-.893 3 0l3 3"/></svg>';

export const iconPhotoDownString =
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M15 8h.01M12.5 21H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6.5"/><path d="m3 16 5-5c.928-.893 2.072-.893 3 0l4 4"/><path d="m14 14 1-1c.653-.629 1.413-.815 2.13-.559M19 16v6M22 19l-3 3-3-3"/></svg>';

export const iconArrowLeftRightString =
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M21 17H3M6 10 3 7l3-3M3 7h18M18 20l3-3-3-3"/></svg>';

export const iconIdString =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z"/><path d="M7 10a2 2 0 1 0 4 0 2 2 0 1 0-4 0M15 8h2M15 12h2M7 16h10"/></svg>';

export const iconMultipleString =
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon icon-tabler icon-tabler-box-multiple" viewBox="0 0 24 24"><path d="M7 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"/><path d="M17 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2"/></svg>';
