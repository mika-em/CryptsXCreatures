'use client';

import Typewriter from './typewriter';

export default function PageWrapper({
  title,
  children,
  centerContent = false,
}) {
  return (
    <div
      className={`flex flex-col ${
        centerContent
          ? 'items-center justify-center min-h-screen'
          : 'items-start'
      } p-8`}
    >
      {title && (
        <h1 className="text-5xl font-bold mb-6 text-accent">
          <Typewriter text={title} delay={100} />
        </h1>
      )}
      <div className="w-full flex justify-center">{children}</div>
    </div>
  );
}
