import Colors from '@/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { getAuthStyles } from '../../../styles/authStyles';

export default function Configuracoes() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const styles = getAuthStyles(colors); // Estilos padrão (inputs, titulos)

    const [dia, setDia] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        carregarConfiguracao();
    }, []);

    const carregarConfiguracao = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserId(user.id);
            const { data } = await supabase
                .from('profiles')
                .select('dia_vencimento')
                .eq('id', user.id)
                .single();
            
            if (data) setDia(String(data.dia_vencimento));
        }
    };

    const handleSalvar = async () => {
        if (!dia || Number(dia) < 1 || Number(dia) > 31) {
            Alert.alert('Erro', 'Insira um dia válido (1-31).');
            return;
        }

        setLoading(true);
        const { error } = await supabase
            .from('profiles')
            .update({ dia_vencimento: Number(dia) })
            .eq('id', userId);

        setLoading(false);

        if (error) Alert.alert('Erro', error.message);
        else {
            Alert.alert('Sucesso', 'Dia de vencimento atualizado!');
            router.back();
        }
    };

    const handleLogout = async () => {
        Alert.alert('Sair', 'Tem certeza que deseja desconectar?', [
            { text: 'Cancelar', style: 'cancel' },
            { 
                text: 'Sair', 
                style: 'destructive', 
                onPress: async () => {
                    await supabase.auth.signOut();
                    
                }
            }
        ]);
    };

    return (
        <View style={[styles.container, {paddingTop: 60}]}>
            <Text style={styles.title}>Configurações</Text>
            <Text style={styles.subtitle}>Defina o dia padrão de vencimento da sua fatura.</Text>

            <View style={styles.form}>
                <Text style={styles.label}>Dia do Vencimento</Text>
                <TextInput
                    style={styles.input}
                    value={dia}
                    onChangeText={setDia}
                    placeholder="Ex: 10"
                    keyboardType="numeric"
                    maxLength={2}
                    placeholderTextColor={colors.tabIconDefault}
                />
            </View>

            
            <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={loading}>
                {loading ? <ActivityIndicator color={colors.background} /> : (
                    <Text style={styles.buttonText}>SALVAR CONFIGURAÇÃO</Text>
                )}
            </TouchableOpacity>

            {/* Divisor Visual */}
            <View style={localStyles.divider} />

            {/* Botão Logout (Vermelho) */}
            <TouchableOpacity 
                style={[styles.button, localStyles.logoutButton]} 
                onPress={handleLogout}
            >
                <Text style={styles.buttonText}>SAIR DA CONTA</Text>
            </TouchableOpacity>
        </View>
    );
}


const localStyles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 30,
        opacity: 0.5
    },
    logoutButton: {
        backgroundColor: '#ff4444', 
        marginTop: 0 
    }
});