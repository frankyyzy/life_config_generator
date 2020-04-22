import React, { useEffect, useRef } from 'react';

export const BlockPageScroll = ({ children }) => {
  const scrollRef = useRef(null);
  useEffect(() => {
    const scrollEl = scrollRef.current;
    scrollEl.addEventListener('wheel', stopScroll);
    return () => scrollEl.removeEventListener('wheel', stopScroll);
  }, []);
  const stopScroll = e => e.preventDefault();
  return <div ref={scrollRef}>{children}</div>;
};
