'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContextProps } from './types';
import { setupInterceptors } from '@/services/http';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [accessToken, setAccessToken] = useState(null);
    const [accessTokenExpiresAt, setAccessTokenExpiresAt] = useState(null);
    const [refreshTokenExpiresAt, setRefreshTokenExpiresAt] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const getAccessToken = () => accessToken;

    useEffect(() => {
        setupInterceptors({
            getAccessToken,
            updateAuth,
            resetAuth
        });
    }, []);

    // Helper function to set tokens
    const setTokens = (tokens) => {
        const { accessToken, accessTokenExpiresAt, refreshTokenExpiresAt } = tokens;
        setAccessToken(accessToken);
        setAccessTokenExpiresAt(accessTokenExpiresAt);
        setRefreshTokenExpiresAt(refreshTokenExpiresAt);
    };

    const resetAuth = () => {
        setAccessToken(null);
        setAccessTokenExpiresAt(null);
        setRefreshTokenExpiresAt(null);
        setUser(null);
        setIsAuthenticated(false);
        setStatus(null);
        setMessage("");
    };

    const isRefreshTokenValid = () => {
        return true
    }

    const updateAuth = (authState) => {
        if (authState.accessToken !== undefined) setAccessToken(authState.accessToken);
        if (authState.accessTokenExpiresAt !== undefined) setAccessTokenExpiresAt(authState.accessTokenExpiresAt);
        if (authState.refreshTokenExpiresAt !== undefined) setRefreshTokenExpiresAt(authState.refreshTokenExpiresAt);
        if (authState.user !== undefined) setUser(authState.user);
        if (authState.isAuthenticated !== undefined) setIsAuthenticated(authState.isAuthenticated);
        if (authState.status !== undefined) setStatus(authState.status);
        if (authState.message !== undefined) setMessage(authState.message);
        if (authState.isLoading !== undefined) setIsLoading(authState.isLoading);
    };

    return (
        <AuthContext.Provider value={{
            // State
            user,
            status,
            message,
            accessToken,
            accessTokenExpiresAt,
            refreshTokenExpiresAt,
            isAuthenticated,
            isLoading,
            // Individual setters
            setUser,
            setStatus,
            setMessage,
            setAccessToken,
            setAccessTokenExpiresAt,
            setRefreshTokenExpiresAt,
            setIsAuthenticated,
            // Helper functions
            setTokens,
            resetAuth,
            setIsLoading,

            //all-in-one update method
            updateAuth,
            getAccessToken,
            isRefreshTokenValid
        }}>{children}</AuthContext.Provider>
    )
}


