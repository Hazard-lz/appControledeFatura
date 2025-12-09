import { StyleSheet } from 'react-native';

export const getFaturaEstimadaStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
        paddingTop: 50, // Ajuste para status bar se necessário
    },
    // Cabeçalho com botão de voltar
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    // Caixa de resumo no topo (Total Geral)
    summaryBox: {
        backgroundColor: colors.tint + '15', // Fundo transparente da cor do tema
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.tint + '30'
    },
    summaryLabel: {
        fontSize: 14,
        color: colors.tabIconDefault,
        marginBottom: 8,
        textTransform: 'uppercase',
        fontWeight: '600',
        letterSpacing: 0.5
    },
    summaryValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.tint,
    },
    // Cards dos Meses (Lista)
    card: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        // Sombra leve
        borderWidth: 1,
        borderColor: colors.tabIconDefault + '30',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        textTransform: 'capitalize'
    },
    divider: {
        height: 1,
        backgroundColor: colors.tabIconDefault + '20', // Linha bem sutil
        marginBottom: 12
    },
    cardValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        alignSelf: 'flex-end'
    },
    emptyText: {
        textAlign: 'center',
        color: colors.tabIconDefault,
        marginTop: 40,
        fontSize: 16
    }
});