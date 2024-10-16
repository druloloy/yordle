'use client';

import dynamic from 'next/dynamic';
const ThemeBox = dynamic(() => import('./_themeBox').then((module) => module._ThemeBox), { ssr: false });
export { ThemeBox };
