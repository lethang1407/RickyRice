import './App.css';
import { Routes, Route} from 'react-router-dom';
import OwnerLayout from './Components/Layout';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgetPassword from './Pages/ForgetPassword';

function App() {
  return (
    <>
      <Routes>
        <Route path='/home' index element={<Home/>}></Route>
        <Route path='/home/owner' element={<OwnerLayout/>}>     
        </Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/forgot-password' element={<ForgetPassword/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
    </Routes>
    </>
  );
}

export default App;
