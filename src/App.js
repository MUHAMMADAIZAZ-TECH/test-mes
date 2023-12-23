import "./App.css";
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Connection } from './pages';
import { useConnection } from './hooks';
import MainLayout from './components/Layout';
import { Baseroutes, Executionroutes } from './routes/routes';
import { useAuth0 } from "@auth0/auth0-react";
import SpectrumDashboard from "./components/Layout/SpectrumDashboard";

const App = () => {
    const { isOnline, wasOnline } = useConnection();
    const token = localStorage.getItem('access_token')
    const { loginWithRedirect, user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    async function handleToken() {
        try {
            const accessToken = await getAccessTokenSilently();
            localStorage.setItem('access_token', accessToken)
        } catch (error) {
            console.error('Error getting access token:', error);
        }
    }
    useEffect(() => {
        if (wasOnline === false && isOnline === true) {
            window.location.reload();
        }

    }, [wasOnline, isOnline]);
    // useEffect(() => {
    //     if (isAuthenticated && token === null) {
    //         handleToken();
    //     } else if (isAuthenticated && token !== null) {
    //         // navigate('/dashboard');
    //     } else if (!isLoading && !token) {
    //         loginWithRedirect()
    //     }
    // }, [isAuthenticated, token, isLoading])
    return (
        <div className="App">
            {isOnline ? (
                <Routes>
                    {!isAuthenticated && <>
                        <Route path="/" element={<SpectrumDashboard />} />
                        <Route path="/base" element={<MainLayout />}>
                            {Baseroutes && Baseroutes.map((route, index) => (
                                <Route key={index} path={`${route.path}`} element={route.element} />
                            ))}
                        </Route>
                        <Route path="/execution" element={<MainLayout />}>
                            {Executionroutes && Executionroutes.map((route, index) => (
                                <Route key={index} path={`${route.path}`} element={route.element} />
                            ))}
                        </Route>
                    </>}
                </Routes>
            ) : (
                <Connection />
            )}
        </div>
    );
};

export default App;
