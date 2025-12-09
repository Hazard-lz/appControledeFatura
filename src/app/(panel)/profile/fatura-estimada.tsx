import Colors from '@/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { getFaturaEstimadaStyles } from '../../../styles/faturaEstimaStyles';

export default function FaturaEstimada() {
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const colors = Colors[theme];
    
    // Usando o estilo externo
    const styles = getFaturaEstimadaStyles(colors);

    const [loading, setLoading] = useState(true);
    const [previsao, setPrevisao] = useState<any[]>([]);
    const [totalGeral, setTotalGeral] = useState(0);

    const calcularEstimativa = async () => {
        setLoading(true);
        
        const { data, error } = await supabase
            .from('faturas')
            .select('*');

        if (error || !data) {
            setLoading(false);
            return;
        }

        const mesesFuturos = [];
        const dataHoje = new Date();
        let somaTotalPeriodo = 0;

        for (let i = 0; i < 12; i++) {
            const dataRef = new Date(dataHoje.getFullYear(), dataHoje.getMonth() + i, 1);
            const mesRef = dataRef.getMonth() + 1;
            const anoRef = dataRef.getFullYear();

            const totalDoMes = data.reduce((acc, item) => {
                const diff = (anoRef - item.ano) * 12 + (mesRef - item.mes);
                const parcelaAtual = diff + 1;
                
                if (parcelaAtual > 0 && parcelaAtual <= (item.total_parcela || 1)) {
                    return acc + Number(item.valor);
                }
                return acc;
            }, 0);

            if (totalDoMes > 0) {
                mesesFuturos.push({
                    id: `${mesRef}-${anoRef}`,
                    mes: mesRef,
                    ano: anoRef,
                    total: totalDoMes,
                    nomeMes: dataRef.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                });
                somaTotalPeriodo += totalDoMes;
            }
        }

        setPrevisao(mesesFuturos);
        setTotalGeral(somaTotalPeriodo);
        setLoading(false);
    };

    useFocusEffect(useCallback(() => {
        calcularEstimativa();
    }, []));

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.nomeMes}</Text>
                <Ionicons name="calendar-outline" size={18} color={colors.tabIconDefault} />
            </View>
            <View style={styles.divider} />
            <Text style={styles.cardValue}>
                {item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => router.back()} style={{padding: 5}}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Estimativa Futura</Text>
                <View style={{width: 24}} /> 
            </View>

            <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Total Comprometido (12 meses)</Text>
                <Text style={styles.summaryValue}>
                    {totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Text>
            </View>

            {loading ? <ActivityIndicator size="large" color={colors.tint} style={{marginTop: 50}} /> : (
                <FlatList
                    data={previsao}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>Sem gastos futuros agendados.</Text>}
                />
            )}
        </View>
    );
}