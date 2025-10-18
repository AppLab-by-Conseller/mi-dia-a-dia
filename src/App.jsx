import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthScreen from './components/auth/AuthScreen';
import PlannerScreen from './components/planner/PlannerScreen';

// Componente para rutas privadas
const PrivateRoute = ({ user, children }) => {
    return user ? children : <Navigate to="/login" />;
};

// Componente principal de la aplicación
export default function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-lg text-gray-600">Cargando...</p>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <AuthScreen />} />
            <Route 
                path="/" 
                element={
                    <PrivateRoute user={user}>
                        <PlannerScreen user={user} />
                    </PrivateRoute>
                } 
            />
        </Routes>
    );
}

// Force redeploy
