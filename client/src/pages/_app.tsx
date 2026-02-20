import { dmSans, manrope } from '@/components/fonts';
import { NextHead } from '@/components/next-head';
import { store } from '@/redux/store';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { appWithTranslation } from 'next-i18next';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextHead title="Opticien Pro" favicon="/favicon.png" />

      <Provider store={store}>
        <div className={`${dmSans.variable} ${manrope.variable} font-sans`}>
          <Component {...pageProps} />
        </div>
      </Provider>
    </>
  );
}

export default appWithTranslation(App);
