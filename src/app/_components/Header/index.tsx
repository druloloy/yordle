import Link from 'next/link';
import React from 'react';

export const Header = () => {
  return (
    <section className="w-full inline-flex items-centere justify-center py-4">
      <Link href="/">
        <span className="text-2xl">yordle</span>
      </Link>
    </section>
  );
};
