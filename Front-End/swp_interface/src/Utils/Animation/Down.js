import { motion} from 'framer-motion';
import { useInView } from 'react-intersection-observer';
function Down({children}){
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,     
  });

  return (
    <motion.div
      ref={ref}    
      initial={{ y: '-10vh', opacity: 0 }}  
      animate={inView ? { y: 0, opacity: 1 } : {}}      
      exit={{ y: '-10vh', opacity: 0 }}   
      transition={{ duration: 0.7 }} >
        {children}
    </motion.div>
  )
}

export default Down;