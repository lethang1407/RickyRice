import { motion} from 'framer-motion';
import { useInView } from 'react-intersection-observer';
function ModalAnimation({children}){
  const { ref, inView } = useInView({
    triggerOnce: false, 
    threshold: 0.1, 
  });

  return (
    <motion.div
      ref={ref}    
      initial={{ x:'10vw',y: '10vh', scale:0 , opacity: 0 }}  
      animate={inView ? { scale:1,x: 0, opacity: 1 } : {}}        
      exit={{ x: '10vw', y:'10vh' , opacity: 0, scale: 0 }}   
      transition={{ duration: 0.7 }} >
        {children}
    </motion.div>
  )
}

export default ModalAnimation;