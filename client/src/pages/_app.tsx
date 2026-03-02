import { dmSans, manrope } from '@/components/fonts';
import { NextHead } from '@/components/next-head';
import { store } from '@/redux/store';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { appWithTranslation } from 'next-i18next';
import { ThemeProvider } from '@/components/theme-provider';

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className={`${dmSans.variable} ${manrope.variable} font-sans`}>
          <NextHead title="Opticien Pro" favicon="/favicon.png" />
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default appWithTranslation(App);
