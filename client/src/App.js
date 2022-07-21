import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './layout/Header';
import AllBlogs from './pages/AllBlogs';

const App = () => {
  return (
    <div className="main__container">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<AllBlogs />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
