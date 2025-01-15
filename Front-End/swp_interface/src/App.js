import logo from './logo.svg';
import './App.css';
import { Routes, Route} from 'react-router-dom';
import Home from './Pages/Home';

function App() {
  return (
    <Routes>
        <Route path='/home' index element={<Home/>}></Route>
    </Routes>
  );
}

export default App;
