import { useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import PropTypes from "prop-types";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { Auth } from "../firebase/firebase.config";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log(user);

  const provider = new GoogleAuthProvider();

  function createUser(email, password) {
    setLoading(true);
    return createUserWithEmailAndPassword(Auth, email, password);
  }

  function updateUser(user) {
    setLoading(true);
    return updateProfile(Auth.currentUser, {
      displayName: user.name,
    });
  }

  function login() {
    setLoading(true);
    return signInWithEmailAndPassword(Auth, user.email, user.password);
  }

  function logOut() {
    setLoading(true);
    return signOut(Auth);
  }

  function signInWithGoogle() {
    setLoading(true);
    return signInWithPopup(Auth, provider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        createUser,
        updateUser,
        login,
        logOut,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
