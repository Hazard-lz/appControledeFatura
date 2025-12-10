import Colors from '@/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
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
    const [dadosGrafico, setDadosGrafico] = useState<{ mes: number, total: number }[]>([]);


    const [nomeMesExibicao, setNomeMesExibicao] = useState('');
    const [diaVencimentoDisplay, setDiaVencimentoDisplay] = useState(10);

    const carregarDados = async () => {
        setLoading(true);
        const dataHoje = new Date();
        let mesAtual = dataHoje.getMonth() + 1;
        let anoAtual = dataHoje.getFullYear();


        const { data: { user } } = await supabase.auth.getUser();


        let diaCorte = 25;

        if (user) {
            if (user.user_metadata?.full_name) {
                setFirstName(user.user_metadata.full_name.split(' ')[0]);
            }

            const { data: perfil } = await supabase
                .from('profiles')
                .select('dia_fechamento, dia_vencimento')
                .eq('id', user.id)
                .single();

            diaCorte = perfil?.dia_fechamento || 25;
            const diaPagamento = perfil?.dia_vencimento || 10;

            setDiaVencimentoDisplay(diaPagamento);


            if (dataHoje.getDate() > diaCorte) {
                mesAtual++;
                if (mesAtual > 12) {
                    mesAtual = 1;
                    anoAtual++;
                }
            }
        }


        const dataNome = new Date(anoAtual, mesAtual - 1, 1);
        const nomeMes = dataNome.toLocaleDateString('pt-BR', { month: 'long' });
        const nomeMesFormatado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
        setNomeMesExibicao(nomeMesFormatado);


        const { data } = await supabase
            .from('faturas')
            .select('*');

        if (data) {

            const total = data.reduce((acc, curr) => {

                let mesCompra = curr.mes;
                let anoCompra = curr.ano;


                if (curr.dia && curr.dia > diaCorte) {
                    mesCompra++;
                    if (mesCompra > 12) {
                        mesCompra = 1;
                        anoCompra++;
                    }
                }

                const diff = (anoAtual - anoCompra) * 12 + (mesAtual - mesCompra);
                const parcelaAtual = diff + 1;

                if (parcelaAtual > 0 && parcelaAtual <= (curr.total_parcela || 1)) {
                    return acc + Number(curr.valor);
                }
                return acc;
            }, 0);

            setTotalMes(total);


            const historico = [];
            for (let i = 5; i >= 0; i--) {
                let mesGrafico = mesAtual - i;
                let anoGrafico = anoAtual;

                if (mesGrafico <= 0) {
                    mesGrafico += 12;
                    anoGrafico--;
                }

                const totalDoMes = data.reduce((acc, curr) => {

                    let mesCompra = curr.mes;
                    let anoCompra = curr.ano;

                    if (curr.dia && curr.dia > diaCorte) {
                        mesCompra++;
                        if (mesCompra > 12) {
                            mesCompra = 1;
                            anoCompra++;
                        }
                    }

                    const diff = (anoGrafico - anoCompra) * 12 + (mesGrafico - mesCompra);
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


            <View style={styles.cardHighlight}>
                <Link href="/(panel)/profile/fatura-estimada">

                    <Text style={styles.cardLabel}>Fatura Estimada ({nomeMesExibicao}) →</Text>
                </Link>

                {loading ? <ActivityIndicator color="#FFF" /> : (
                    <View>
                        <Text style={styles.cardValue}>
                            {totalMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </Text>


                        <Text style={{ color: colors.background, fontSize: 13, marginTop: 4, fontWeight: '500', alignSelf: 'center' }}>
                            Vence dia {diaVencimentoDisplay}
                        </Text>
                    </View>
                )}
            </View>



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