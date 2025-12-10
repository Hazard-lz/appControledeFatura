import Colors from '@/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { getGerenciarFaturaStyles } from '../../../styles/gerenciarFaturaStyles';

export default function GerenciarFatura() {
    const params = useLocalSearchParams();
    const mode = params.mode === 'edit' ? 'edit' : 'create';
    const idFatura = params.id;

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const styles = getGerenciarFaturaStyles(colors);

    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');

    const [dia, setDia] = useState('');
    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');

    const [totalParcelas, setTotalParcelas] = useState('1');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && idFatura) {
            carregarDadosEdicao();
        } else {
            const hoje = new Date();
            setDia(String(hoje.getDate()));
            setMes(String(hoje.getMonth() + 1));
            setAno(String(hoje.getFullYear()));
        }
    }, [idFatura]);

    const carregarDadosEdicao = async () => {
        const { data } = await supabase.from('faturas').select('*').eq('id', idFatura).single();
        if (data) {
            setNome(data.nome);
            setValor(String(data.valor));
            setDia(String(data.dia || ''));
            setMes(String(data.mes));
            setAno(String(data.ano));
            setTotalParcelas(String(data.total_parcela || 1));
        }
    };

    const handleSalvar = async () => {
        if (!nome || !valor || !dia || !mes || !ano) {
            Alert.alert('Erro', 'Preencha todos os campos da data e valor.');
            return;
        }

        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        const payload = {
            user_id: user?.id,
            nome,
            valor: parseFloat(valor.replace(',', '.')),
            dia: Number(dia),
            mes: Number(mes),
            ano: Number(ano),
            total_parcela: Number(totalParcelas) || 1,
            parcelas_pagas: 0
        };

        let error;
        if (mode === 'create') {
            const res = await supabase.from('faturas').insert(payload);
            error = res.error;
        } else {
            const res = await supabase.from('faturas').update(payload).eq('id', idFatura);
            error = res.error;
        }

        setLoading(false);
        if (error) Alert.alert('Erro', error.message);
        else {
            Alert.alert('Sucesso', 'Despesa salva!');
            router.back();
        }
    };

    const handleExcluir = async () => {
        Alert.alert('Excluir', 'Tem certeza?', [
            { text: 'Cancelar' },
            {
                text: 'Excluir', style: 'destructive',
                onPress: async () => {
                    await supabase.from('faturas').delete().eq('id', idFatura);
                    router.back();
                }
            }
        ]);
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
            <Text style={styles.title}>{mode === 'create' ? 'Nova Despesa' : 'Editar Despesa'}</Text>

            <View style={styles.form}>
                <Text style={{ color: colors.text, marginBottom: 5, fontWeight: 'bold' }}>Nome</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Almoço"
                    placeholderTextColor={colors.tabIconDefault}
                    value={nome} onChangeText={setNome}
                />

                <Text style={{ color: colors.text, marginBottom: 5, fontWeight: 'bold' }}>Valor da parcela</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: 50.00"
                    keyboardType="numeric"
                    placeholderTextColor={colors.tabIconDefault}
                    value={valor} onChangeText={setValor}
                />

                <Text style={{ color: colors.text, marginBottom: 5, fontWeight: 'bold' }}>Data da Compra (Dia / Mês / Ano)</Text>
                <View style={styles.rowContainer}>
                    {/* INPUT DO DIA ADICIONADO AQUI */}
                    <TextInput
                        style={[styles.input, styles.rowInput]}
                        placeholder="Dia"
                        keyboardType="numeric"
                        maxLength={2}
                        value={dia} onChangeText={setDia}
                    />
                    <TextInput
                        style={[styles.input, styles.rowInput]}
                        placeholder="Mês"
                        keyboardType="numeric"
                        maxLength={2}
                        value={mes} onChangeText={setMes}
                    />
                    <TextInput
                        style={[styles.input, styles.rowInput]}
                        placeholder="Ano"
                        keyboardType="numeric"
                        maxLength={4}
                        value={ano} onChangeText={setAno}
                    />
                </View>

                <Text style={{ color: colors.text, marginBottom: 5, fontWeight: 'bold' }}>Quantidade de Parcelas</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: 1 (À vista)"
                    keyboardType="numeric"
                    placeholderTextColor={colors.tabIconDefault}
                    value={totalParcelas} onChangeText={setTotalParcelas}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={loading}>
                {loading ? <ActivityIndicator color={colors.background} /> : (
                    <Text style={styles.buttonText}>SALVAR</Text>
                )}
            </TouchableOpacity>

            {mode === 'edit' && (
                <TouchableOpacity style={styles.deleteButton} onPress={handleExcluir}>
                    <Text style={styles.buttonText}>EXCLUIR</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}