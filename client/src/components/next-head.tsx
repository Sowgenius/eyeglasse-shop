import Head from 'next/head';

type NextHeadProps = {
  title?: string;
  favicon?: string;
} & ({ title: string } | { favicon: string });

export function NextHead({ favicon, title }: NextHeadProps) {
  return (
    <Head>
      {title && <title>{`${title.trim()} | Z-0`}</title>}
      {favicon && (
        <link rel="shortcut icon" href={favicon} type="image/x-icon" />
      )}
    </Head>
  );
}
