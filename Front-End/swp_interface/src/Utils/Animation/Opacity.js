import { motion} from 'framer-motion';
import { useInView } from 'react-intersection-observer';
function Opacity({children}){
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,     
  });

  return (
    <motion.div
      ref={ref}    
      initial={{ opacity: 0 }}  
      animate={inView ? { opacity: 1 } : {}}      
      exit={{  opacity: 0 }}   
      transition={{ duration: 1 }}
      style={{width: '100%'}}
      >
        {children}
    </motion.div>
  )
}

export default Opacity;