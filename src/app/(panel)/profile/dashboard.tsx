import Colors from '@/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import { Ionicons } from '@expo/vector-icons'; // Importe o ícone
import { useFocusEffect } from '@react-navigation/native';
import { Link, router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { getDashboardStyles } from '../../../styles/dashboardStyles';

export default function Dashboard() {
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const colors = Colors[theme];
    const styles = getDashboardStyles(colors);

    const [loading, setLoading] = useState(true);
    const [totalMes, setTotalMes] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [dadosGrafico, setDadosGrafico] = useState<{mes: number, total: number}[]>([]);

    const carregarDados = async () => {
        setLoading(true);
        const dataHoje = new Date();
        let mesAtual = dataHoje.getMonth() + 1;
        let anoAtual = dataHoje.getFullYear();

        // 1. Busca Usuário e Dia de Vencimento
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // Pega o nome
            if (user.user_metadata?.full_name) {
                setFirstName(user.user_metadata.full_name.split(' ')[0]);
            }

            // Pega o Dia de Vencimento para fazer a virada
            const { data: perfil } = await supabase
                .from('profiles')
                .select('dia_vencimento')
                .eq('id', user.id)
                .single();
            
            const diaCorte = perfil?.dia_vencimento || 10;

            // A MÁGICA NO DASHBOARD: Ajusta o "Mês Atual" se já passou do dia
            if (dataHoje.getDate() >= diaCorte) {
                mesAtual++;
                if (mesAtual > 12) {
                    mesAtual = 1;
                    anoAtual++;
                }
            }
        }

        // 2. Busca Faturas
        const { data } = await supabase
            .from('faturas')
            .select('*'); // Traz tudo para calcular correto

        if (data) {
            // Calcula Total do Mês (Considerando o Mês Ajustado acima)
            const total = data.reduce((acc, curr) => {
                // Mesma lógica de parcela da lista
                const diff = (anoAtual - curr.ano) * 12 + (mesAtual - curr.mes);
                const parcelaAtual = diff + 1;

                // Se a parcela cai neste mês ajustado, soma
                if (parcelaAtual > 0 && parcelaAtual <= (curr.total_parcela || 1)) {
                    return acc + Number(curr.valor);
                }
                return acc;
            }, 0);
            
            setTotalMes(total);

            // Monta Gráfico (Últimos 6 meses baseados no mês ajustado)
            const historico = [];
            for (let i = 5; i >= 0; i--) { 
                // Volta 'i' meses a partir do atual
                let mesGrafico = mesAtual - i;
                let anoGrafico = anoAtual;
                
                if (mesGrafico <= 0) {
                    mesGrafico += 12;
                    anoGrafico--;
                }

                // Soma total daquele mês histórico
                const totalDoMes = data.reduce((acc, curr) => {
                    const diff = (anoGrafico - curr.ano) * 12 + (mesGrafico - curr.mes);
                    const p = diff + 1;
                    if (p > 0 && p <= (curr.total_parcela || 1)) return acc + Number(curr.valor);
                    return acc;
                }, 0);

                historico.push({ mes: mesGrafico, total: totalDoMes });
            }
            setDadosGrafico(historico);
        }
        
        setLoading(false);
    };

    useFocusEffect(useCallback(() => {
        carregarDados();
    }, []));

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
            
            {/* CABEÇALHO COM ÍCONE DE CONFIGURAÇÃO */}
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.greeting}>
                        {firstName ? `Olá, ${firstName}!` : 'Olá!'}
                    </Text>
                    <Text style={styles.dateText}>
                        Resumo de {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </Text>
                </View>

                <TouchableOpacity 
                    onPress={() => router.push('/(panel)/profile/configuracoes')}
                    style={styles.settingsButton}
                >
                    <Ionicons name="settings-outline" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* Card Principal */}
            <View style={styles.cardHighlight}>
                <Link href="/(panel)/profile/fatura-estimada">
                    <Text style={styles.cardLabel}>Fatura Estimada (Mês Atual)</Text>
                </Link>
                    {loading ? <ActivityIndicator color="#FFF" /> : (
                    <Text style={styles.cardValue}>
                        {totalMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Text>
                )}
            </View>

            {/* Gráfico */}
            <Text style={styles.sectionTitle}>Histórico (Semestre)</Text>
            <View style={styles.chartContainer}>
                {dadosGrafico.map((d) => {
                    const height = d.total > 0 ? (d.total / 5000) * 100 : 5; 
                    return (
                        <View key={d.mes} style={styles.barContainer}>
                            <View style={[styles.bar, { height: height > 100 ? 100 : height }]} />
                            <Text style={styles.barLabel}>{d.mes}</Text>
                        </View>
                    )
                })}
            </View>

            {/* Botões de Ação */}
            <View style={styles.actionContainer}>
                <Link href="/(panel)/profile/faturas" asChild>
                    <TouchableOpacity style={styles.buttonOutline}>
                        <Text style={styles.buttonOutlineText}>VISUALIZAR FATURAS</Text>
                    </TouchableOpacity>
                </Link>

                <TouchableOpacity 
                    style={styles.buttonPrimary}
                    onPress={() => router.push({ pathname: '/(panel)/profile/gerenciar-fatura', params: { mode: 'create' } })}
                >
                    <Text style={styles.buttonPrimaryText}>NOVA DESPESA</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}