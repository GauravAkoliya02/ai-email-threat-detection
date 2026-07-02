import { motion } from "framer-motion";

function Background() {
  return (
    <div className="background">

      <motion.div
        className="blob blob1"
        animate={{
          x: [0, 120, 0],
          y: [0, -80, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
      />

      <motion.div
        className="blob blob2"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
        }}
      />

      <motion.div
        className="blob blob3"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />

      <div className="grid"></div>

    </div>
  );
}

export default Background;