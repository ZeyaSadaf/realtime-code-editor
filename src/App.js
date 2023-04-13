import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import NoPage from './pages/NoPage';
import { Toaster } from 'react-hot-toast';


function App() {

  return (
    <>
    <div>
      <Toaster position = "center-top"></Toaster>
    </div>
    <BrowserRouter>
    <Routes>
      <Route path = "/editor/:roomId" element = {<EditorPage />}></Route> 
      {/* <Route path = "/editor" element = {<EditorPage />}></Route> */}
      <Route path ="/" element = {<Home />}> </Route>
      <Route path = "*" element = {<NoPage />}></Route> 
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
