import Image from 'next/image';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';

export default function Home() {
  return (
  <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
        <Image
          className="dark:invert"
          src="/logo.png"
          alt="Crypts x Creatures"
          width={200}
          height={200}
          priority
      />
      </div>
  );
}
