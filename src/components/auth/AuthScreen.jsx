import React, { useState } from 'react';
import { auth } from '../../firebase/config';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    Heading,
    Input,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

const AuthScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            toast({
                title: `¡${isLogin ? 'Inicio de sesión' : 'Registro'} exitoso!`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            setError(err.message);
            toast({
                title: 'Error de autenticación',
                description: err.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.50">
            <Box
                as="form"
                onSubmit={handleSubmit}
                p={8}
                maxW="md"
                borderWidth={1}
                borderRadius="xl"
                boxShadow="lg"
                bg="white"
                w="full"
            >
                <Stack spacing={6}>
                    <Box textAlign="center">
                        <Heading as="h2" size="xl">
                            {isLogin ? 'Bienvenida/o de nuevo' : 'Crea tu cuenta'}
                        </Heading>
                        <Text mt={2} color="gray.600">
                            Un espacio seguro para organizar tu día.
                        </Text>
                    </Box>
                    
                    <FormControl isInvalid={error}>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Correo electrónico"
                            required
                            size="lg"
                        />
                    </FormControl>

                    <FormControl isInvalid={error}>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            required
                            size="lg"
                        />
                        {error && <FormErrorMessage>{error}</FormErrorMessage>}
                    </FormControl>

                    <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        isLoading={loading}
                        w="full"
                    >
                        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                    </Button>

                    <Text textAlign="center">
                        {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                        <Button
                            variant="link"
                            colorScheme="blue"
                            ml={2}
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                        >
                            {isLogin ? 'Regístrate' : 'Inicia Sesión'}
                        </Button>
                    </Text>
                </Stack>
            </Box>
        </Flex>
    );
};

export default AuthScreen;
