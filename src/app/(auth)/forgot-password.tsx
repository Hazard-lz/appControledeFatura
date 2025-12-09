import Colors from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { getAuthStyles } from '../../styles/authStyles';

export default function ForgotPassword() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const styles = getAuthStyles(colors);
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  async function handleResetPassword() {
    if (!email) {
      Alert.alert('Erro', 'Digite seu e-mail.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    setLoading(false);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      router.push({
        pathname: '/(auth)/reset-password-confirm',
        params: { email: email } 
      });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.subtitle}>Digite seu e-mail para receber o código de verificação.</Text>
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

        <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
          {loading ? (
             <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.buttonText}>ENVIAR CÓDIGO</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Link href="/(auth)/signin/page" asChild>
          <TouchableOpacity>
            <Text style={styles.linkText}>Voltar para o Login</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}