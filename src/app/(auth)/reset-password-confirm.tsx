import Colors from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { getAuthStyles } from '../../styles/authStyles';

export default function ResetPasswordConfirm() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const styles = getAuthStyles(colors);
  
  const router = useRouter();
  
  const params = useLocalSearchParams();
  const initialEmail = typeof params.email === 'string' ? params.email : '';

  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    if (!email) return Alert.alert('Erro', 'Por favor, confirme seu e-mail.');
    if (!token) return Alert.alert('Erro', 'Digite o código recebido no e-mail.');
    if (!password) return Alert.alert('Erro', 'Digite a nova senha.');

    setLoading(true);

    try {
        const { data, error: otpError } = await supabase.auth.verifyOtp({
            email: email,
            token: token,
            type: 'recovery',
        });

        if (otpError) {
            throw new Error(`Código inválido: ${otpError.message}`);
        }

        const { error: updateError } = await supabase.auth.updateUser({
            password: password
        });

        if (updateError) {
            throw new Error(`Erro ao salvar senha: ${updateError.message}`);
        }

        Alert.alert('Sucesso', 'Sua senha foi redefinida com sucesso!');
        router.replace('/(panel)/profile/page');

    } catch (error: any) {
        Alert.alert('Falha', error.message);
    } finally {
        setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Redefinir Senha</Text>
        <Text style={styles.subtitle}>
          Insira o código recebido no e-mail e sua nova senha.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor={colors.tabIconDefault}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Código de Verificação</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o código"
            placeholderTextColor={colors.tabIconDefault}
            keyboardType="number-pad"
            value={token}
            onChangeText={setToken}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nova Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Nova senha forte"
            placeholderTextColor={colors.tabIconDefault}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
            style={styles.button} 
            onPress={handleResetPassword} 
            disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.buttonText}>ALTERAR SENHA</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.back()} style={{marginTop: 20}}>
            <Text style={[styles.linkText, {textAlign: 'center'}]}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}