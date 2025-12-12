# 📱 Aplicativo de Controle de Fatura

![Badge Status](https://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)

## 📖 Sobre o projeto

O **Controle de Fatura** é uma aplicação mobile desenvolvida para auxiliar na organização financeira pessoal. O foco principal do app é permitir o gerenciamento de gastos com cartão de crédito, oferecendo uma visão clara das faturas atuais e uma estimativa precisa dos meses futuros.

A aplicação utiliza **Supabase** para garantir segurança na autenticação e integridade dos dados em tempo real.

---


## ⚙️ Funcionalidades

### 🔐 Autenticação
- [x] Login seguro com E-mail e Senha.
- [x] Cadastro de novos usuários.
- [x] **Recuperação de Senha** (token via e-mail).
- [x] Logout seguro.

### 💰 Gestão de Faturas
- [x] **Estimativa Futura:** Visualização do valor projetado para os próximos meses.
- [x] **CRUD de Faturas:** Cadastrar novas compras e editar lançamentos existentes.
- [x] **Cálculo Automático:** O app soma automaticamente os itens e projeta o total da fatura.

### ⚙️ Configurações
- [x] Definição personalizada do **dia de fechamento** da fatura para cálculo correto dos vencimentos.

---

## 🛠 Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

- **Mobile:** [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
- **Backend & Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Gerenciamento de Estado:** (useState simples)

---

## 🚀 Como rodar o projeto

### Pré-requisitos
Antes de começar, você precisa ter instalado em sua máquina:
- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- O aplicativo **Expo Go** no seu celular ou um emulador.

### 🎲 Configuração do Ambiente (Supabase)

1. Crie um arquivo `.env` na raiz do projeto baseado no exemplo.
2. Adicione as suas chaves do Supabase:

```bash
EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima

```
### Crie as seguintes tabelas no Supabase:
![image](https://github.com/user-attachments/assets/2886e427-e12f-4da3-8840-fa627626ca67)
