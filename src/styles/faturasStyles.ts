import { StyleSheet } from 'react-native';

export const getFaturasStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 50, // Espaço para status bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  // Área de Filtros (Mês/Ano)
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.tabIconDefault,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: colors.text,
    textAlign: 'center',
  },
  filterButton: {
    backgroundColor: colors.tint,
    borderRadius: 8,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Card da Fatura (Item da Lista)
  itemCard: {
    backgroundColor: colors.background, // Pode usar uma cor de 'card' se tiver no tema
    borderWidth: 1,
    borderColor: colors.tabIconDefault + '40', // 40 no final adiciona transparência no hex
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  itemSubtitle: {
    fontSize: 14,
    color: colors.tabIconDefault,
    marginTop: 4,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.tint,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.tabIconDefault,
    fontSize: 16,
  },
});