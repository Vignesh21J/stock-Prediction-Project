import { useState, createContext } from 'react'

// Create context
const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem('accessToken')  // !! is used for return true or false not the full access token.
    );

    return (
        <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;
export {AuthContext};