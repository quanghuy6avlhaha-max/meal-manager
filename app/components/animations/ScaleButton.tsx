"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"button">;

export default function ScaleButton({
  children,
  className,
  ...props
}: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}