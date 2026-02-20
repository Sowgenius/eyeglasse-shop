import { DM_Sans, Manrope } from 'next/font/google';

export const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

// Use manrope as the main font (similar to Arbeit style)
export const arbeit = manrope;
