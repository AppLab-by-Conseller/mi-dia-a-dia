import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthScreen from './components/auth/AuthScreen';
import PlannerScreen from './components/planner/PlannerScreen';
import AccountScreen from './components/account/AccountScreen';
import MembershipScreen from './components/MembershipScreen';
import SideMenu from './components/layout/SideMenu';
import { Box, Flex, Spinner, Center, VStack } from '@chakra-ui/react';

// Componente para rutas privadas
const PrivateRoute = ({ user, children }) => {
    return user ? (
        <Box minH="100vh" display="flex" flexDirection="row">
            <Box as="aside" w={{ base: 'full', md: '250px' }} minW="250px" zIndex={2}>
                <SideMenu user={user} />
            </Box>
            <Box as="main" flex="1" minW={0} bg="gray.50" p={{ base: 2, md: 8 }}>
                {children}
            </Box>
        </Box>
    ) : <Navigate to="/login" />;
};

// Componente principal de la aplicación
export default function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Center h="100vh">
                <VStack>
                    <Spinner size="xl" color="blue.500" />
                    <p>Cargando...</p>
                </VStack>
            </Center>
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
            <Route 
                path="/account" 
                element={
                    <PrivateRoute user={user}>
                        <AccountScreen />
                    </PrivateRoute>
                } 
            />
            <Route 
                path="/membership" 
                element={
                    <PrivateRoute user={user}>
                        <MembershipScreen />
                    </PrivateRoute>
                } 
            />
        </Routes>
    );
}

// Forzar actualización de caché
