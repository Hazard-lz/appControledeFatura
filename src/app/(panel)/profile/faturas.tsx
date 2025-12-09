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

    // Filtros (Iniciam vazios ou com data atual, depende da sua preferencia. Vou por atual.)
    const [mesFiltro, setMesFiltro] = useState(String(new Date().getMonth() + 1));
    const [anoFiltro, setAnoFiltro] = useState(String(new Date().getFullYear()));
    const [diaVencimentoUser, setDiaVencimentoUser] = useState(10); // Padrão

    const carregarDados = async () => {
        setLoading(true);

        // 1. Busca Dia de Vencimento do Usuário
        let diaCorte = 10; // Valor padrão
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            const { data: perfil } = await supabase
                .from('profiles')
                .select('dia_vencimento')
                .eq('id', user.id)
                .single();
            if (perfil?.dia_vencimento) {
                diaCorte = perfil.dia_vencimento;
                setDiaVencimentoUser(diaCorte);
            }
        }

        // 2. Busca TODAS as faturas
        const { data, error } = await supabase
            .from('faturas')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !data) {
            setLoading(false);
            return;
        }

        // 3. Lógica de "Virada de Fatura"
        const faturasCalculadas = data.map((item) => {
            const hoje = new Date();
            let mesRef, anoRef;

            // SE TEM FILTRO: Usa o filtro
            if (mesFiltro && anoFiltro) {
                mesRef = Number(mesFiltro);
                anoRef = Number(anoFiltro);
            } 
            // SE NÃO TEM FILTRO (Modo Atual): Aplica a regra do dia de vencimento
            else {
                mesRef = hoje.getMonth() + 1;
                anoRef = hoje.getFullYear();

                // A MÁGICA: Se hoje passou do dia de corte, o app mostra a fatura do mês que vem
                if (hoje.getDate() >= diaCorte) {
                    mesRef++;
                    if (mesRef > 12) {
                        mesRef = 1;
                        anoRef++;
                    }
                }
            }

            // Cálculo da parcela com base no MesRef ajustado
            const diff = (anoRef - item.ano) * 12 + (mesRef - item.mes);
            const parcelaAtual = diff + 1;

            return {
                ...item,
                parcela_exibicao: parcelaAtual,
                status_calculado: parcelaAtual > 0 && parcelaAtual <= (item.total_parcela || 1) ? 'ATIVA' : 'INATIVA'
            };
        });

        // 4. Aplica o Filtro Visual
        const listaFinal = faturasCalculadas.filter(item => {
            if (mesFiltro === '' || anoFiltro === '') return true; 
            return item.status_calculado === 'ATIVA';
        });

        setListaExibicao(listaFinal);
        setLoading(false);
    };

    useFocusEffect(useCallback(() => {
        carregarDados();
    }, [mesFiltro, anoFiltro]));

    // Função para limpar filtros
    const limparFiltros = () => {
        setMesFiltro('');
        setAnoFiltro('');
    };

    const renderItem = ({ item }: { item: any }) => {
        // Se filtro estiver limpo, mostra informação genérica ou a atual
        const textoParcela = item.status_calculado === 'ATIVA'
            ? `Parcela ${item.parcela_exibicao}/${item.total_parcela}`
            : (item.parcela_exibicao > item.total_parcela ? 'Finalizada' : 'Agendada');

        return (
            <TouchableOpacity
                style={[styles.itemCard, item.status_calculado !== 'ATIVA' && { opacity: 0.6 }]} // Opacidade se não for do mês
                onPress={() => router.push({ pathname: '/(panel)/profile/gerenciar-fatura', params: { id: item.id, mode: 'edit' } })}
            >
                <View>
                    <Text style={styles.itemTitle}>{item.nome}</Text>
                    <Text style={{ fontSize: 15, color: colors.placeholder, paddingTop: 2 }}>
                        {item.dia ? `${item.dia}/` : ''}{item.mes}/{item.ano}
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.itemValue}>
                        R$ {Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                    <Text style={{ fontSize: 15, color: colors.placeholder, paddingTop: 2 }}>
                        {textoParcela}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Minhas Faturas</Text>
                <TouchableOpacity onPress={() => router.push('/(panel)/profile/gerenciar-fatura')}>
                    <Ionicons name="add-circle" size={32} color={colors.tint} />
                </TouchableOpacity>
            </View>

            {/* Container de Filtros */}
            <View style={styles.filterContainer}>
                <TextInput
                    style={styles.filterInput}
                    value={mesFiltro} onChangeText={setMesFiltro}
                    keyboardType="numeric" placeholder="Mês" placeholderTextColor={colors.placeholder}
                />
                <TextInput
                    style={styles.filterInput}
                    value={anoFiltro} onChangeText={setAnoFiltro}
                    keyboardType="numeric" placeholder="Ano" placeholderTextColor={colors.placeholder}
                />

                {/* Botão de Buscar (Recarrega) */}
                <TouchableOpacity style={styles.filterButton} onPress={carregarDados}>
                    <Ionicons name="search" size={20} color={colors.background} backgroundColor={colors.tint} />
                </TouchableOpacity>

                {/* Botão de Limpar (X Vermelho) */}
                {(mesFiltro !== '' || anoFiltro !== '') && (
                    <TouchableOpacity style={[styles.filterButton, { backgroundColor: '#ff4444' }]} onPress={limparFiltros}>
                        <Ionicons name="close" size={20} color="#FFF" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Aviso se filtro estiver limpo */}
            {mesFiltro === '' && (
                <Text style={{ textAlign: 'center', marginBottom: 10, color: colors.tabIconDefault, fontStyle: 'italic' }}>
                    Exibindo histórico completo
                </Text>
            )}

            {loading ? <ActivityIndicator size="large" color={colors.tint} /> : (
                <FlatList
                    data={listaExibicao}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma fatura encontrada.</Text>}
                />
            )}
        </View>
    );
}