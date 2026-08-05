import React, { useEffect, useRef, useState } from 'react';
import './AnimatedCounter.css';

const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  delay = 0, 
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  ...props 
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = performance.now();
    const startValue = 0;
    const endValue = end;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out quart)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentCount = startValue + (endValue - startValue) * easeOutQuart;
      setCount(currentCount);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const timeoutId = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, end, duration, delay]);

  const formattedCount = count.toFixed(decimals);

  return (
    <span ref={ref} className={`animated-counter ${className}`} {...props}>
      {prefix}{formattedCount}{suffix}
    </span>
  );
};

export default AnimatedCounter;
