import React, { useState } from 'react';
import { auth, db } from '../../firebase/config';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import {
    Box,
    Button,
    Divider,
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
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                const trialEndDate = new Date();
                trialEndDate.setDate(trialEndDate.getDate() + 30); // 30 días de prueba

                // Crear documento de usuario en Firestore
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    email: user.email,
                    role: 'patient', // Rol por defecto
                    createdAt: new Date(),
                    subscriptionStatus: 'trial',
                    subscriptionEndDate: trialEndDate,
                });
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

    const handleForgotPassword = async (email) => {
        if (!email) {
            toast({
                title: 'Ingresa tu correo electrónico',
                status: 'warning',
                duration: 4000,
                isClosable: true,
            });
            return;
        }
        setLoading(true);
        try {
            auth.languageCode = 'es'; // Establecer idioma español para el email
            await sendPasswordResetEmail(auth, email);
            toast({
                title: 'Correo de recuperación enviado',
                description: 'Revisa tu bandeja de entrada para restablecer la contraseña.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (err) {
            toast({
                title: 'Error al enviar recuperación',
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
        <Flex minH="100vh" w="100vw" direction="column" align="center" justify="flex-start" bg="gray.50">
            <Box w="full" maxW="600px" px={4} pt={12} pb={4} textAlign="center">
                <Heading as="h1" size="2xl" mb={2}>
                    Mi Día a Día
                </Heading>
                <Text fontSize="lg" color="gray.700" mb={2}>
                    Tu espacio seguro para ordenar, sentir y sanar.
                </Text>
                <Text color="gray.600" mb={4}>
                    Una app diseñada para acompañarte en tu proceso terapéutico, ayudarte a organizar tus rutinas cotidianas y conectar con tu mundo emocional.<br/>
                    💬 Planificá tu día.<br/>
                    📊 Registrá cómo te sentiste.<br/>
                    📝 Escribí lo que no querés olvidar.<br/>
                    <br/>
                    Convertí tu rutina en un espacio de autoconocimiento.
                </Text>
                <Divider mb={4} />
            </Box>
            <Flex w="full" justify="center">
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
                    mb={12}
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
                            {isLogin && (
                                <Button variant="link" colorScheme="blue" size="sm" mt={2} onClick={() => handleForgotPassword(email)}>
                                    Olvidé mi contraseña
                                </Button>
                            )}
                            {error && <FormErrorMessage>{error}</FormErrorMessage>}
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            size="lg"
                            isLoading={loading}
                            className="btn-login-full"
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
        </Flex>
    );
};

export default AuthScreen;
