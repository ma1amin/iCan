import React, { useEffect, useRef, useState } from 'react';
import './ScrollReveal.css';

const ScrollReveal = ({ 
  children, 
  threshold = 0.1, 
  delay = 0, 
  animation = 'fadeInSlideUp',
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, hasAnimated]);

  const animationClasses = {
    fadeInSlideUp: 'scroll-reveal-fade-in-slide-up',
    fadeIn: 'scroll-reveal-fade-in',
    slideUp: 'scroll-reveal-slide-up',
    scaleIn: 'scroll-reveal-scale-in',
    slideIn: 'scroll-reveal-slide-in'
  };

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${animationClasses[animation] || animationClasses.fadeInSlideUp} ${isVisible ? 'scroll-reveal-visible' : ''} ${className}`}
      style={{ animationDelay: delay }}
      {...props}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
