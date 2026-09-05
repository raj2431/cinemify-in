import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import ContentDetail from './pages/ContentDetail';
import MyList from './pages/MyList';
import ProfileSwitcher from './pages/ProfileSwitcher';
import Dashboard from './pages/Admin/Dashboard';
import ContentForm from './pages/Admin/ContentForm';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/title/:id" element={<ContentDetail />} />
          <Route path="/my-list" element={<ProtectedRoute><MyList /></ProtectedRoute>} />
          <Route path="/profiles" element={<ProtectedRoute><ProfileSwitcher /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/new" element={<AdminRoute><ContentForm /></AdminRoute>} />
          <Route path="/admin/edit/:id" element={<AdminRoute><ContentForm /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
