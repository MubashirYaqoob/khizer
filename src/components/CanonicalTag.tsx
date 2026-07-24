"use client";
import { usePathname } from 'next/navigation';
import Head from 'next/head';

export default function CanonicalTag() {
  const pathname = usePathname();
  const baseUrl = 'https://www.khizarfabrics.pk';
  const canonicalUrl = `${baseUrl}${pathname}`;
  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}
