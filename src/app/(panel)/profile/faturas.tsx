import Colors from '@/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { getFaturasStyles } from '../../../styles/faturasStyles';

export default function Faturas() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const styles = getFaturasStyles(colors);

    const [loading, setLoading] = useState(false);
    const [listaExibicao, setListaExibicao] = useState<any[]>([]);


    const [mesFiltro, setMesFiltro] = useState('');
    const [anoFiltro, setAnoFiltro] = useState('');


    const [referenciaTexto, setReferenciaTexto] = useState('');

    const carregarDados = async () => {
        
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
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !data) {
            setLoading(false);
            return;
        }


        const hoje = new Date();
        let mesRef, anoRef;

        if (mesFiltro && anoFiltro) {
            mesRef = Number(mesFiltro);
            anoRef = Number(anoFiltro);
            setReferenciaTexto(`Filtro: ${mesRef}/${anoRef}`);
        } else {
            mesRef = hoje.getMonth() + 1;
            anoRef = hoje.getFullYear();


            if (hoje.getDate() > diaFechamento) {
                mesRef++;
                if (mesRef > 12) {
                    mesRef = 1;
                    anoRef++;
                }
            }

            const dataNome = new Date(anoRef, mesRef - 1, 1);
            const nomeMes = dataNome.toLocaleDateString('pt-BR', { month: 'long' });
            setReferenciaTexto(`Mês Atual (Vigente): ${nomeMes}/${anoRef}`);
        }


        const faturasCalculadas = data.map((item) => {

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

            return {
                ...item,
                parcela_exibicao: parcelaAtual,
                status_calculado: parcelaAtual > 0 && parcelaAtual <= (item.total_parcela || 1) ? 'ATIVA' : 'INATIVA'
            };
        });


        const listaFinal = faturasCalculadas.filter(item => {
            if (mesFiltro === '' && anoFiltro === '') return true;
            return item.status_calculado === 'ATIVA';
        });

        setListaExibicao(listaFinal);
        setLoading(false);
    };


    useFocusEffect(useCallback(() => {
        carregarDados();
    }, [mesFiltro, anoFiltro]));

    const limparFiltros = () => {
        setMesFiltro('');
        setAnoFiltro('');
    };

    const renderItem = ({ item }: { item: any }) => {

        let textoParcela = '';
        let corParcela = colors.text;

        if (item.status_calculado === 'ATIVA') {
            textoParcela = `Parcela ${item.parcela_exibicao}/${item.total_parcela}`;
            corParcela = '#228B22';
        } else if (item.parcela_exibicao > item.total_parcela) {
            textoParcela = 'Finalizada';
            corParcela = colors.placeholder;
        } else {
            textoParcela = 'Agendada (Futura)';
            corParcela = '#FFA500';
        }

        return (
            <TouchableOpacity
                style={[styles.itemCard, item.status_calculado !== 'ATIVA' && { opacity: 0.7 }]}
                onPress={() => router.push({ pathname: '/(panel)/profile/gerenciar-fatura', params: { id: item.id, mode: 'edit' } })}
            >
                <View>
                    <Text style={styles.itemTitle}>{item.nome}</Text>
                    <Text style={{ fontSize: 14, color: colors.placeholder, paddingTop: 2 }}>
                        Compra: {item.dia ? `${item.dia}/` : ''}{item.mes}/{item.ano}
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.itemValue}>
                        R$ {Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                    <Text style={{ fontSize: 14, color: corParcela, fontWeight: '500', paddingTop: 2 }}>
                        {textoParcela}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Minhas Despesas</Text>
                <TouchableOpacity onPress={() => router.push('/(panel)/profile/gerenciar-fatura')}>
                    <Ionicons name="add-circle" size={32} color={colors.tint} />
                </TouchableOpacity>
            </View>


            <View style={styles.filterContainer}>
                <TextInput
                    style={styles.filterInput}
                    value={mesFiltro} onChangeText={setMesFiltro}
                    keyboardType="numeric" placeholder="Mês" placeholderTextColor={colors.placeholder}
                    maxLength={2}
                />
                <TextInput
                    style={styles.filterInput}
                    value={anoFiltro} onChangeText={setAnoFiltro}
                    keyboardType="numeric" placeholder="Ano" placeholderTextColor={colors.placeholder}
                    maxLength={4}
                />

                <TouchableOpacity style={styles.filterButton} onPress={carregarDados}>
                    <Ionicons name="search" size={20} color={colors.background} />
                </TouchableOpacity>

                {(mesFiltro !== '' || anoFiltro !== '') && (
                    <TouchableOpacity style={[styles.filterButton, { backgroundColor: '#ff4444' }]} onPress={limparFiltros}>
                        <Ionicons name="close" size={20} color="#FFF" />
                    </TouchableOpacity>
                )}
            </View>


            <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
                <Text style={{ textAlign: 'center', color: colors.tint, fontWeight: '600', fontSize: 13 }}>
                    {referenciaTexto}
                </Text>
            </View>

            {loading ? <ActivityIndicator size="large" color={colors.tint} /> : (
                <FlatList
                    data={listaExibicao}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma despesa encontrada.</Text>}
                />
            )}
        </View>
    );
}