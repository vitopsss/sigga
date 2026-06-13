# Guia de Arquitetura e Sobrevivência (Para Fundadores com IA)

Como você está construindo sistemas reais com o apoio de Inteligências Artificiais, o seu principal trabalho não é "decorar código", mas sim **entender como as peças se encaixam**. Quando você entende as peças, você dá comandos muito melhores para a IA e resolve problemas muito mais rápido.

Aqui estão os conceitos fundamentais do seu projeto, explicados sem complicação:

---

## 1. O Fluxo de Vida de uma Tela (Client x Server)

A internet funciona em um fluxo de **Perguntas (Request)** e **Respostas (Response)**.

### O Cliente (Navegador)
É onde as coisas acontecem na tela do seu usuário (Chrome, Safari, celular). O Cliente é "burro" para os dados, ele só sabe desenhar botões, mostrar cores e reagir ao clique do mouse. Quando o usuário clica em "Fazer Login", o Cliente não sabe se a senha está certa. Ele tem que mandar a senha para o Servidor.

### O Servidor (Vercel)
É o computador "inteligente" que fica na nuvem. Quando o Cliente manda o clique com a senha, o Servidor pega essa senha, confere regras de segurança, mastiga as informações e diz pro Cliente: "Pode deixar ele entrar" ou "Senha errada!".
- **Next.js** é a tecnologia que usamos para fazer tanto a tela (Cliente) quanto a lógica de segurança (Servidor) morarem no mesmo lugar, de forma rápida.

---

## 2. A Memória do Sistema (O Banco de Dados)

O Servidor não tem memória de longo prazo. Se o Vercel reiniciar, ele esquece tudo. É por isso que precisamos de um Banco de Dados.

### Supabase (PostgreSQL)
É como uma planilha de Excel ultra avançada e gigantesca. Ela guarda os e-mails, as senhas, os nomes das Organizações, e os Atendimentos. Ele fica em um computador separado do Vercel. 

### Prisma (O Tradutor)
O Vercel fala uma língua (JavaScript) e o Banco de Dados fala outra língua (SQL). O **Prisma** é o nosso tradutor. 
Sempre que a gente precisa buscar um usuário, o código (Prisma) manda uma mensagem pro Supabase: *"Me dê a linha da tabela de Usuários onde o email é test@sigga.org"*. 

**⚠️ Onde mora o perigo:** Essa comunicação entre Vercel e Supabase gasta "Conexões". Se o Vercel mandar 20 perguntas ao mesmo tempo e o seu Supabase só aguentar conversar com 15 pessoas por vez (o seu limite atual), o Supabase tranca a porta e o site cai (o erro que tivemos hoje!).

---

## 3. Como a gente pinta as telas (Tailwind CSS)

Antigamente, para deixar um botão verde e com borda redonda, a gente criava um arquivo separado gigantesco. Hoje usamos o **Tailwind**.
- Com o Tailwind, a gente digita o estilo direto na tag do HTML.
- Se quisermos um botão verde, arredondado e com texto branco, usamos as palavras mágicas: `bg-green-600 rounded-lg text-white`.
- Quando precisar de alguma mudança de design, é só pedir para a IA: *"Deixe a tela com um estilo de Tailwind mais suave, com bordas arredondadas e sombras."*

---

## 4. O que fazer quando a tela dá "Erro" ou "Quebra"?

A primeira coisa que um Arquiteto de Software faz quando o site cai é descobrir **onde a corrente partiu**:

1. **A tela não carrega ou o CSS tá feio?**
   - O problema está no **Cliente** (Navegador) ou no **Tailwind**.
2. **Ao clicar num botão, dá "Erro Inesperado" ou 500?**
   - O problema está no **Servidor** (Next.js na Vercel). Provavelmente o código tentou processar algo e falhou.
3. **O site demora anos pra carregar e acusa falha, ou o log acusa algo como "Timeout / Connection / Column does not exist"?**
   - A corrente quebrou entre o **Servidor** e o **Banco de Dados** (Prisma x Supabase). Pode ser o limite de conexões que estourou, ou a gente esqueceu de criar a coluna no banco.

---

## 5. Dicionário Rápido para pedir ajuda à IA

Quando for me pedir alterações, usar esses termos ajuda muito a gente focar no alvo certo:

- **"Deploy"**: Pegar o código que está no GitHub e colocar no servidor ao vivo da Vercel.
- **"Seed"**: Rodar um script para injetar dados falsos/testes no banco de dados.
- **"Commit"**: Salvar o checkpoint de um código que está funcionando.
- **"Migrate" / "Schema"**: Atualizar a estrutura do Banco de Dados (ex: adicionar uma nova coluna chamada `idade` na tabela de usuários).
- **"Componente"**: Um pedacinho da tela (ex: a Barra Lateral, o Botão de Login, o Gráfico) que a gente programa separadamente para organizar o código.

---
*Escrito pela sua IA parceira de engenharia. Guarde este guia e revise-o sempre que for começar a planejar uma nova funcionalidade!*
