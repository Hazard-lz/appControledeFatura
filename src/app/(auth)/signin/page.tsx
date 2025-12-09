import Colors from '@/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { getAuthStyles } from '../../../styles/authStyles';

export default function Login() {

    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const colors = Colors[theme]; 
    const styles = getAuthStyles(colors); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSignIn() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) Alert.alert('Erro', error.message);
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Bem-vindo</Text>
                <Text style={styles.subtitle}>Faça login para continuar</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="seu@email.com"
                        placeholderTextColor={colors.tabIconDefault} 
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Sua senha"
                        placeholderTextColor={colors.tabIconDefault}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <View style={{ alignItems: 'flex-end', marginBottom: 20 }}>
                    <Link href="/(auth)/forgot-password" asChild>
                        <TouchableOpacity>
                            <Text style={{ color: colors.tint, fontWeight: '600' }}>
                                Esqueceu a senha?
                            </Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color={colors.background} />
                    ) : (
                        <Text style={styles.buttonText}>ENTRAR</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Não tem uma conta?</Text>
                <Link href="/(auth)/signup/page" asChild>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>Cadastre-se</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}