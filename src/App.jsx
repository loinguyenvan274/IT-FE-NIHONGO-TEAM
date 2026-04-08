import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Dangtintuyendung/Dangtintuyendung';
import Manhinhmatching from './pages/Manhinhmatching/Manhinhmatching';
import Timkiemcongviec from './pages/Timkiemcongviec/Timkiemcongviec';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/matching" element={<Manhinhmatching />} />
        <Route path="/search" element={<Timkiemcongviec />} />
      </Routes>
    </Router>
  );
}

export default App;