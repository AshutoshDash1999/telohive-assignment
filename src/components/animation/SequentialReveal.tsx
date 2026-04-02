"use client";

import { motion, type Variants } from "motion/react";
import { Children, type ReactNode } from "react";

interface SequentialRevealProps {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
}

const CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const ITEM_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function SequentialReveal({
  children,
  className,
  itemClassName,
}: SequentialRevealProps) {
  const items = Children.toArray(children);

  return (
    <motion.div
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {items.map((item, index) => (
        <motion.div key={index} variants={ITEM_VARIANTS} className={itemClassName}>
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}
