
// Animation utilities for consistent animations across components

export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.1, 0.25, 1] 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    transition: { 
      duration: 0.3, 
      ease: [0.25, 0.1, 0.25, 1] 
    } 
  }
};

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.3, 
      ease: [0.25, 0.1, 0.25, 1] 
    } 
  },
  exit: { 
    opacity: 0, 
    transition: { 
      duration: 0.2, 
      ease: [0.25, 0.1, 0.25, 1] 
    } 
  }
};

export const staggerChildren = (
  delayChildren: number = 0.05, 
  staggerChildren: number = 0.1
) => ({
  visible: {
    transition: {
      delayChildren,
      staggerChildren,
    }
  }
});

// Subtle hover animation for cards and interactive elements
export const hoverScale = {
  scale: 1.01,
  transition: { 
    duration: 0.2, 
    ease: [0.25, 0.1, 0.25, 1] 
  }
};

// Smooth height animation for expanding/collapsing elements
export const expandHeight = (initialHeight: number = 0) => ({
  enter: {
    height: "auto",
    transition: { 
      duration: 0.3, 
      ease: [0.25, 0.1, 0.25, 1] 
    }
  },
  exit: {
    height: initialHeight,
    transition: { 
      duration: 0.3, 
      ease: [0.25, 0.1, 0.25, 1] 
    }
  }
});

// For subtle loading indicators
export const pulseAnimation = {
  scale: [1, 1.02, 1],
  opacity: [1, 0.85, 1],
  transition: {
    duration: 2,
    ease: "easeInOut",
    repeat: Infinity,
  }
};
