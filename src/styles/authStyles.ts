import { StyleSheet } from 'react-native';


export const getAuthStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, 
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.tint, 
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.tabIconDefault,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text, 
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: colors.background, 
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.tabIconDefault, 
  },
  button: {
    backgroundColor: colors.tint, 
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: colors.background, 
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: colors.tabIconDefault,
    fontSize: 14,
  },
  linkText: {
    color: colors.tint,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
  },
});