import { motion } from 'framer-motion';

const Field = ({ children, style, ...props }) => {
  return (
    <motion.div
      className="field-component"
      style={{ padding: 5, margin: 5, ...style }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
export default Field;
