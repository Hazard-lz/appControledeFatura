import { StyleSheet } from 'react-native';

export const getDashboardStyles = (colors: any) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
    padding: 20 
  },
  
  // --- CABEÇALHO (Texto + Configurações) ---
  headerRow: { 
      marginTop: 40, 
      marginBottom: 30,
      flexDirection: 'row', // Alinha itens lado a lado
      justifyContent: 'space-between', // Separa: Texto na esq, Ícone na dir
      alignItems: 'center'
  },
  greeting: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: colors.text 
  },
  dateText: { 
    fontSize: 16, 
    color: colors.tabIconDefault,
    marginTop: 4
  },
  settingsButton: {
      padding: 10, // Área de toque maior
      backgroundColor: colors.background,
      borderRadius: 50, // Círculo perfeito
      borderWidth: 1,
      borderColor: colors.tabIconDefault + '30', // 30% de opacidade na borda
      justifyContent: 'center',
      alignItems: 'center'
  },

  // --- CARD PRINCIPAL (Resumo) ---
  cardHighlight: {
    backgroundColor: colors.tint,
    borderRadius: 20, // Mais arredondado
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
    // Sombras suaves para dar profundidade
    shadowColor: colors.tint,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8, // Sombra Android
  },
  cardLabel: { 
    color: colors.background, 
    fontSize: 14, 
    fontWeight: '600',
    opacity: 0.9, 
    marginBottom: 8,
    textTransform: 'uppercase', // Estilo mais profissional
    letterSpacing: 1
  },
  cardValue: { 
    color: colors.background, 
    fontSize: 36, 
    fontWeight: 'bold' 
  },

  // --- GRÁFICO ---
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: colors.text, 
    marginBottom: 16 
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    backgroundColor: colors.text + '05', // 5% da cor do texto (funciona em Light e Dark)
    borderRadius: 16,
    padding: 20,
    marginBottom: 32
  },
  barContainer: { 
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1, // Distribui espaço igualmente
  },
  bar: { 
    width: 12, 
    backgroundColor: colors.tint, 
    borderRadius: 6,
    minHeight: 4 // Garante que barras vazias ainda tenham um "pontinho"
  },
  barLabel: { 
    marginTop: 12, 
    fontSize: 12, 
    fontWeight: '500',
    color: colors.tabIconDefault 
  },

  // --- BOTÕES DE AÇÃO ---
  actionContainer: { 
    gap: 16 // Espaço entre os botões
  },
  
  // Botão Primário (Nova Despesa)
  buttonPrimary: {
    backgroundColor: colors.tint,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPrimaryText: { 
    color: colors.background, 
    fontWeight: 'bold', 
    fontSize: 16,
    letterSpacing: 0.5
  },
  
  // Botão Secundário (Ver Faturas)
  buttonOutline: {
    borderWidth: 1.5, // Borda um pouco mais grossa
    borderColor: colors.tint,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  buttonOutlineText: { 
    color: colors.tint, 
    fontWeight: 'bold', 
    fontSize: 16,
    letterSpacing: 0.5
  },
});