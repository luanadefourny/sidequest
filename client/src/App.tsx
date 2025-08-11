import { Routes, Route, BrowserRouter } from 'react-router';
import TestComponent from './components/TestComponent/TestComponent.tsx'
import './App.css';

export default function App() {

  return (
    <BrowserRouter>
     <Routes>
      <Route path="/" element={<TestComponent />}></Route>
      {/*<Route path="/home" element={<component here />}> </Route>*/}
    </Routes>
    </BrowserRouter>
  )
}
