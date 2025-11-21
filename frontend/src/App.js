// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import StaticHome from './pages/StaticHome';
// import Home from './pages/Home';
// import Signup from './pages/Signup';
// import Dashboard from './pages/Dashboard';
// import './App.css';

// // Protect routes that require login
// const ProtectedRoute = ({ children }) => {
//   const { currentUser } = useAuth();
//   return currentUser ? children : <Navigate to="/" />;
// };

// // Restrict routes for logged-in users
// const PublicRoute = ({ children }) => {
//   const { currentUser } = useAuth();
//   return !currentUser ? children : <Navigate to="/dashboard" />;
// };

// // ✅ Removed <Router> — BrowserRouter already exists in index.js
// function AppContent() {
//   return (
//     <div className="App">
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <PublicRoute>
//               <StaticHome />
//             </PublicRoute>
//           }
//         />
//         <Route
//           path="/signup"
//           element={
//             <PublicRoute>
//               <Signup />
//             </PublicRoute>
//           }
//         />
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/home"
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </div>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }

// export default App;






import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import StaticHome from './pages/StaticHome';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
};

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/dashboard" />;
};

function AppContent() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <StaticHome />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
