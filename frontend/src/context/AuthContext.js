// import React, { createContext, useState, useContext, useEffect } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [savedLooks, setSavedLooks] = useState([]); // Initialize as empty array

//   // Load saved looks from localStorage on component mount
//   useEffect(() => {
//     const savedLooksFromStorage = localStorage.getItem('savedLooks');
//     if (savedLooksFromStorage) {
//       setSavedLooks(JSON.parse(savedLooksFromStorage));
//     }
//   }, []);

//   // Save looks to localStorage whenever savedLooks changes
//   useEffect(() => {
//     localStorage.setItem('savedLooks', JSON.stringify(savedLooks));
//   }, [savedLooks]);

//   const login = (userData) => {
//     setCurrentUser(userData);
//   };

//   const signup = (userData) => {
//     setCurrentUser(userData);
//   };

//   const logout = () => {
//     setCurrentUser(null);
//   };

//   const saveLook = (look) => {
//     const newLook = {
//       ...look,
//       id: Date.now(), // Add unique ID
//       date: new Date().toISOString().split('T')[0] // Add current date
//     };
//     setSavedLooks(prevLooks => [...prevLooks, newLook]);
//   };

//   const value = {
//     currentUser,
//     savedLooks: savedLooks || [], // Ensure it's always an array
//     login,
//     signup,
//     logout,
//     saveLook,
//     setSavedLooks
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };





// import React, { createContext, useState, useContext, useEffect } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [savedLooks, setSavedLooks] = useState([]);

//   // ✅ Load savedLooks from localStorage
//   // useEffect(() => {
//   //   const storedLooks = localStorage.getItem('savedLooks');
//   //   if (storedLooks) setSavedLooks(JSON.parse(storedLooks));

//   //   // ✅ Load logged-in user if available
//   //   const storedUser = localStorage.getItem('currentUser');
//   //   if (storedUser) setCurrentUser(JSON.parse(storedUser));
//   // }, []);

// // ✅ Load savedLooks from localStorage
// useEffect(() => {
//   const storedLooks = localStorage.getItem('savedLooks');
//   if (storedLooks) setSavedLooks(JSON.parse(storedLooks));

//   // ✅ Load logged-in user if available
//   const storedUser = localStorage.getItem('currentUser');
//   if (storedUser) {
//     const parsedUser = JSON.parse(storedUser);
//     setCurrentUser(parsedUser);
//     console.log('AuthProvider: currentUser loaded from localStorage =', parsedUser); // <-- check here
//   } else {
//     console.log('AuthProvider: no currentUser found'); // <-- check here
//   }
// }, []);




//   // ✅ Save updates to localStorage
//   useEffect(() => {
//     localStorage.setItem('savedLooks', JSON.stringify(savedLooks));
//   }, [savedLooks]);

//   useEffect(() => {
//     if (currentUser)
//       localStorage.setItem('currentUser', JSON.stringify(currentUser));
//     else
//       localStorage.removeItem('currentUser');
//   }, [currentUser]);

//   // Auth actions
//   // const login = (userData) => setCurrentUser(userData);
//   // const signup = (userData) => setCurrentUser(userData);

// const login = (userData) => {
//   setCurrentUser(userData);
//   console.log('AuthProvider: login -> currentUser =', userData); // <-- check here
// };
// const signup = (userData) => {
//   setCurrentUser(userData);
//   console.log('AuthProvider: signup -> currentUser =', userData); // <-- check here
// };



//   const logout = () => {
//     setCurrentUser(null);
//     localStorage.removeItem('currentUser');
//   };

//   const saveLook = (look) => {
//     const newLook = {
//       ...look,
//       id: Date.now(),
//       date: new Date().toISOString().split('T')[0],
//     };
//     setSavedLooks((prev) => [...prev, newLook]);
//   };

//   const value = {
//     currentUser,
//     savedLooks,
//     login,
//     signup,
//     logout,
//     saveLook,
//     setSavedLooks,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };


import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [savedLooks, setSavedLooks] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ new

  // Load savedLooks and currentUser from localStorage
  useEffect(() => {
    const storedLooks = localStorage.getItem('savedLooks');
    if (storedLooks) setSavedLooks(JSON.parse(storedLooks));

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      console.log('AuthProvider: currentUser loaded from localStorage =', parsedUser);
    } else {
      console.log('AuthProvider: no currentUser found');
    }

    setLoading(false); // ✅ done loading
  }, []);

  // Save updates to localStorage
  useEffect(() => {
    localStorage.setItem('savedLooks', JSON.stringify(savedLooks));
  }, [savedLooks]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
    else localStorage.removeItem('currentUser');
  }, [currentUser]);

  // Auth actions
  const login = (userData) => {
    setCurrentUser(userData);
    console.log('AuthProvider: login -> currentUser =', userData);
  };

  const signup = (userData) => {
    setCurrentUser(userData);
    console.log('AuthProvider: signup -> currentUser =', userData);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const saveLook = (look) => {
    const newLook = { ...look, id: Date.now(), date: new Date().toISOString().split('T')[0] };
    setSavedLooks((prev) => [...prev, newLook]);
  };

  const value = { currentUser, savedLooks, login, signup, logout, saveLook, setSavedLooks };

  // ✅ Only render children after loading is finished
  if (loading) return null; // or a spinner component

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
