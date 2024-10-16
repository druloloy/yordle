import React, { forwardRef } from 'react';

interface Props {
  left?: boolean;
  right?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Gutter: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>> = forwardRef<
  HTMLDivElement,
  Props
>((props, ref) => {
  const { left = true, right = true, className, children } = props;

  return (
    <div
      ref={ref}
      className={['gutter', left && 'gutterLeft', right && 'gutterRight', className].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
});

Gutter.displayName = 'Gutter';
