import { StyleSheet } from 'react-native';

export const getGerenciarFaturaStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    justifyContent: 'center', // Centraliza verticalmente se quiser, ou tire para ficar no topo
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  input: {
    height: 56,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.tabIconDefault,
    marginBottom: 16,
  },
  // Container para inputs lado a lado (Mês e Ano)
  rowContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  rowInput: {
    flex: 1, // Faz dividir o espaço igualmente
  },
  // Botão Principal (Salvar)
  button: {
    backgroundColor: colors.tint,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  // Botão de Excluir (Vermelho)
  deleteButton: {
    backgroundColor: '#ff4444', // Vermelho alerta
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
});