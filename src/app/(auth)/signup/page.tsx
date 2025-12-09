import Colors from '@/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { getAuthStyles } from '../../../styles/authStyles';

export default function Register() {

    const theme = useColorScheme() ?? 'light';
    const colors = Colors[theme];
    const styles = getAuthStyles(colors);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSignUp() {
        if (!name.trim()) {
            Alert.alert('Atenção', 'Por favor, digite seu nome completo.');
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });

        if (error) {
            Alert.alert('Erro', error.message);
        } else {
            Alert.alert('Sucesso', 'Conta criada! Verifique seu e-mail.');
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Criar Conta</Text>
                <Text style={styles.subtitle}>Preencha os dados abaixo</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome Completo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Seu nome"
                        placeholderTextColor={colors.tabIconDefault}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

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
                        placeholder="Crie uma senha forte"
                        placeholderTextColor={colors.tabIconDefault}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color={colors.background} />
                    ) : (
                        <Text style={styles.buttonText}>CADASTRAR</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Já possui conta?</Text>
                <Link href="/(auth)/signin/page" asChild>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>Fazer Login</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}