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

    const styles = getFaturaEstimadaStyles(colors);

    const [loading, setLoading] = useState(true);
    const [previsao, setPrevisao] = useState<any[]>([]);
    const [totalGeral, setTotalGeral] = useState(0);

    const calcularEstimativa = async () => {
        setLoading(true);


        let diaFechamento = 25;
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: perfil } = await supabase
                .from('profiles')
                .select('dia_fechamento')
                .eq('id', user.id)
                .single();

            if (perfil?.dia_fechamento) {
                diaFechamento = perfil.dia_fechamento;
            }
        }


        const { data, error } = await supabase
            .from('faturas')
            .select('*');

        if (error || !data) {
            setLoading(false);
            return;
        }

        const mesesFuturos = [];
        const dataBase = new Date();
        let somaTotalPeriodo = 0;


        if (dataBase.getDate() > diaFechamento) {
            dataBase.setMonth(dataBase.getMonth() + 1);
        }


        for (let i = 0; i < 12; i++) {
            const dataRef = new Date(dataBase.getFullYear(), dataBase.getMonth() + i, 1);
            const mesRef = dataRef.getMonth() + 1;
            const anoRef = dataRef.getFullYear();

            const totalDoMes = data.reduce((acc, item) => {

                let mesCompra = item.mes;
                let anoCompra = item.ano;

                if (item.dia && item.dia > diaFechamento) {
                    mesCompra++;
                    if (mesCompra > 12) {
                        mesCompra = 1;
                        anoCompra++;
                    }
                }

                const diff = (anoRef - anoCompra) * 12 + (mesRef - mesCompra);
                const parcelaAtual = diff + 1;

                if (parcelaAtual > 0 && parcelaAtual <= (item.total_parcela || 1)) {
                    return acc + Number(item.valor);
                }
                return acc;
            }, 0);

            if (totalDoMes > 0) {
                let nomeMes = dataRef.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                nomeMes = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

                mesesFuturos.push({
                    id: `${mesRef}-${anoRef}`,
                    mes: mesRef,
                    ano: anoRef,
                    total: totalDoMes,
                    nomeMes: nomeMes,
                    isAtual: i === 0
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
        <View style={[styles.card, item.isAtual && { borderColor: colors.tint, borderWidth: 1 }]}>
            <View style={styles.cardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons
                        name={item.isAtual ? "calendar" : "calendar-outline"}
                        size={18}
                        color={item.isAtual ? colors.tint : colors.tabIconDefault}
                    />
                    <Text style={[styles.cardTitle, item.isAtual && { color: colors.tint, fontWeight: 'bold' }]}>
                        {item.nomeMes} {item.isAtual ? '(Atual)' : ''}
                    </Text>
                </View>
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
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Estimativa Futura</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Total Comprometido (Próx. 12 meses)</Text>
                <Text style={styles.summaryValue}>
                    {totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Text>
            </View>

            {loading ? <ActivityIndicator size="large" color={colors.tint} style={{ marginTop: 50 }} /> : (
                <FlatList
                    data={previsao}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma despesa futura encontrada.</Text>}
                />
            )}
        </View>
    );
}