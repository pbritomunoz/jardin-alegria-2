import { ThemeType } from './types';

export const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-y6LfkWCRBH8wM0XRLjQD0w_svKUnAOX0gLi3t_ltsfgcaiVLCcALaq35_SaQMkS3XnuoPSTw2BGc/pub?gid=0&single=true&output=csv';

export const THEMES: Record<ThemeType, { bg: string, text: string, accent: string, card: string, mute: string }> = {
  morning: {
    bg: 'bg-[#FAF8F3]',
    text: 'text-[#1A1A1A]',
    accent: 'text-[#2D6A4F]',
    card: 'bg-white',
    mute: 'text-[#6B6B6B]'
  },
  midnight: {
    bg: 'bg-[#0F1412]',
    text: 'text-[#E8F3ED]',
    accent: 'text-[#95D5B2]',
    card: 'bg-[#1A231F]',
    mute: 'text-[#A0AFAA]'
  },
  sunset: {
    bg: 'bg-[#1C1917]',
    text: 'text-[#FDE68A]',
    accent: 'text-[#F59E0B]',
    card: 'bg-[#292524]',
    mute: 'text-[#D6D3D1]'
  }
};
