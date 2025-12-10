import Colors from '@/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { getAuthStyles } from '../../../styles/authStyles';

export default function Configuracoes() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const styles = getAuthStyles(colors);

    const [diaVencimento, setDiaVencimento] = useState('');
    const [diaFechamento, setDiaFechamento] = useState(''); 
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
                .select('dia_vencimento, dia_fechamento')
                .eq('id', user.id)
                .single();
            
            if (data) {
                setDiaVencimento(String(data.dia_vencimento || ''));
                setDiaFechamento(String(data.dia_fechamento || ''));
            }
        }
    };

    // Função auxiliar para validar dias
    const validarDia = (texto: string) => {
        // Remove tudo que não for número
        const numero = texto.replace(/[^0-9]/g, '');
        return numero;
    };

    const handleSalvar = async () => {
        const v = Number(diaVencimento);
        const f = Number(diaFechamento);

        // --- VALIDAÇÃO DE SEGURANÇA ---
        if (v < 1 || v > 31 || f < 1 || f > 31) {
            Alert.alert('Erro', 'Por favor, insira dias válidos entre 1 e 31.');
            return;
        }

        setLoading(true);
        
        const { error } = await supabase
            .from('profiles')
            .update({ 
                dia_vencimento: v,
                dia_fechamento: f
            })
            .eq('id', userId);

        setLoading(false);

        if (error) Alert.alert('Erro', error.message);
        else {
            Alert.alert('Sucesso', 'Configurações atualizadas!');
            router.back();
        }
    };

    const handleLogout = async () => {
        Alert.alert('Sair', 'Tem certeza?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair', style: 'destructive', onPress: async () => await supabase.auth.signOut() }
        ]);
    };

    return (
        <View style={[styles.container, {paddingTop: 40}]}>
            <Text style={styles.title}>Configurações</Text>
            
            <View style={styles.form}>
                <Text style={styles.label}>Dia do Fechamento (Virada da Fatura)</Text>
                <TextInput
                    style={styles.input}
                    value={diaFechamento}
                    onChangeText={(t) => setDiaFechamento(validarDia(t))}
                    placeholder="Ex: 25"
                    keyboardType="numeric"
                    maxLength={2}
                    placeholderTextColor={colors.tabIconDefault}
                />
                <Text style={{fontSize: 12, color: colors.placeholder, marginBottom: 15, marginTop: 5}}>
                    Dia em que sua fatura fecha para novas compras.
                </Text>

                <Text style={styles.label}>Dia do Vencimento (Pagamento)</Text>
                <TextInput
                    style={styles.input}
                    value={diaVencimento}
                    onChangeText={(t) => setDiaVencimento(validarDia(t))}
                    placeholder="Ex: 5"
                    keyboardType="numeric"
                    maxLength={2}
                    placeholderTextColor={colors.tabIconDefault}
                />
                 <Text style={{fontSize: 12, color: colors.placeholder, marginBottom: 15, marginTop: 5}}>
                    Apenas informativo (exibido no Dashboard).
                </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={loading}>
                {loading ? <ActivityIndicator color={colors.background} /> : (
                    <Text style={styles.buttonText}>SALVAR</Text>
                )}
            </TouchableOpacity>


            <View style={{height: 1, backgroundColor: '#ccc', marginVertical: 30, opacity: 0.5}} />

            <TouchableOpacity style={[styles.button, {backgroundColor: '#ff4444', marginTop: 0}]} onPress={handleLogout}>
                <Text style={styles.buttonText}>SAIR DA CONTA</Text>
            </TouchableOpacity>
        </View>
    );
}