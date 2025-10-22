import React from 'react';
import { Box, VStack, Heading, Link, Text, Divider, Button, Spacer } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom'; // Importar RouterLink
import { Home, Users, BarChart2, Star, User, LogOut } from 'lucide-react';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';

const NavItem = ({ icon, children, to = '#' }) => (
    <Link
        as={RouterLink} // Usar RouterLink para la navegación
        to={to}
        display="flex"
        alignItems="center"
        p={3}
        borderRadius="md"
        _hover={{ bg: 'blue.600', textDecoration: 'none' }}
        _focus={{ boxShadow: 'none' }}
        w="full"
    >
        {icon}
        <Text ml={3}>{children}</Text>
    </Link>
);

const SubscriptionStatus = ({ user }) => {
    if (!user || user.subscriptionStatus !== 'trial') {
        return null;
    }

    const endDate = user.subscriptionEndDate?.toDate();
    if (!endDate) return null;

    const daysRemaining = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <Box textAlign="center" p={3} bg="blue.800" borderRadius="md">
            <Text fontSize="sm" fontWeight="bold">
                {daysRemaining > 0 ? `Días de prueba: ${daysRemaining}` : 'Prueba finalizada'}
            </Text>
            {daysRemaining > 0 && (
                 <Button
                    mt={2}
                    size="sm"
                    colorScheme="yellow"
                    leftIcon={<Star size={16} />}
                 >
                    Mejorar Plan
                 </Button>
            )}
        </Box>
    );
};


const SideMenu = ({ user }) => {
    const userRole = user?.role || 'patient';

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <Box
            as="nav"
            pos="fixed"
            left="0"
            top="0"
            h="full"
            w="250px"
            bg="blue.700"
            color="white"
            p={5}
        >
            <VStack spacing={4} align="stretch">
                <Heading as="h1" size="lg" mb={6}>
                    <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
                        Mi Día a Día
                    </Link>
                </Heading>

                {userRole === 'admin' && (
                    <>
                        <NavItem icon={<Users size={20} />} to="/admin/users">
                            Gestionar Usuarios
                        </NavItem>
                        <NavItem icon={<BarChart2 size={20} />} to="/admin/stats">
                            Estadísticas
                        </NavItem>
                        <Divider />
                    </>
                )}

                <NavItem icon={<Home size={20} />} to="/">
                    Planner
                </NavItem>
                <NavItem icon={<User size={20} />} to="/account">
                    Mi Cuenta
                </NavItem>

                <Spacer />

                <SubscriptionStatus user={user} />

                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    justifyContent="flex-start"
                    p={3}
                    className="btn-logout"
                    leftIcon={<LogOut size={20} />}
                    color="white"
                >
                    Cerrar Sesión
                </Button>
            </VStack>
        </Box>
    );
};

export default SideMenu;
