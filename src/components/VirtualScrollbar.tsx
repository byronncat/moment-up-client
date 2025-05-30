import React, { useCallback, useRef, useMemo } from 'react';

export const VirtualScrollbar = ({
  height,
  totalHeight,
  width,
  onScroll,
  scrollTop,
}: {
  height: number;
  totalHeight: number;
  width: number;
  onScroll: (scrollTop: number) => void;
  scrollTop: number;
}) => {
  const isDragging = useRef<boolean>(false);
  const animationFrame = useRef<number>(0);
  
  const { thumbHeight, maxScrollTop, scrollRatio, thumbTop } = useMemo(() => {
    const thumbHeight = Math.max(30, (height / totalHeight) * height);
    const maxScrollTop = height - thumbHeight;
    const scrollRatio = scrollTop / (totalHeight - height);
    const thumbTop = scrollRatio * maxScrollTop;
    
    return { thumbHeight, maxScrollTop, scrollRatio, thumbTop };
  }, [height, totalHeight, scrollTop]);

  const handleCustomScroll = useCallback((newScrollTop: number) => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    
    animationFrame.current = requestAnimationFrame(() => {
      onScroll(newScrollTop);
    });
  }, [onScroll]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    
    const startY = e.pageY;
    const startScrollTop = thumbTop;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const delta = e.pageY - startY;
      const newThumbTop = Math.max(
        0,
        Math.min(maxScrollTop, startScrollTop + delta)
      );
      const newScrollTop = (newThumbTop / maxScrollTop) * (totalHeight - height);
      
      handleCustomScroll(newScrollTop);
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseup", handleMouseUp, { passive: true });
  }, [thumbTop, maxScrollTop, totalHeight, height, handleCustomScroll]);

  const scrollbarStyle = useMemo(() => ({
    position: 'absolute' as const,
    right: 0,
    top: 0,
    width,
    height,
  }), [width, height]);

  const thumbStyle = useMemo(() => ({
    position: 'absolute' as const,
    top: thumbTop,
    left: 0,
    width: '100%',
    height: thumbHeight,
    backgroundColor: isDragging.current ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.4)',
    cursor: 'pointer',
    willChange: 'transform, top',
    transition: isDragging.current ? 'none' : 'background-color 0.15s ease',
  }), [thumbTop, thumbHeight]);

  if (totalHeight <= height) return null;

  return (
    <div 
      className="absolute right-0 top-0 bg-black/10 rounded-md"
      style={{ width, height }}
    >
      <div
        className="absolute left-0 w-full rounded-md cursor-pointer transition-colors duration-150 ease-in-out"
        style={{
          ...thumbStyle,
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}; 