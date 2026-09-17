# NTT DATA Workshop MVP

Aplicação estática e responsiva para recolha de respostas de participantes e vista de administrador em Portugal.

## Funcionalidades

- Fluxo de conversação para participantes em português de Portugal
- Estilo visual inspirado em NTT DATA, sem brand EDP
- Persistência local em `localStorage`
- Mensagens de sincronização pendente e retry local
- Vista estática `/admin` para facilitar a revisão das respostas
- Exportação em CSV para análise do facilitador
- Limite de configuração para integração opcional com Supabase em `static/js/config.js`

## Como testar localmente

1. Abra um terminal na pasta do projeto.
2. Execute:
   - `npm start`
3. Aceda a:
   - `http://localhost:4173/` para a experiência do participante
   - `http://localhost:4173/admin/` para a vista do facilitador

## Configuração opcional do Supabase

O ficheiro `static/js/config.js` contém a fronteira de configuração para uma integração futura com Supabase. Por omissão, a aplicação funciona em modo local sem qualquer credencial:

```js
window.APP_CONFIG = {
  appName: 'NTT DATA | Workshop de Experiência',
  locale: 'pt-PT',
  supabase: {
    enabled: false,
    url: '',
    anonKey: '',
    table: 'participant_responses'
  }
};
```

Quando `enabled` for `true`, a funcionalidade de sincronização tentará publicar cada resposta para a tabela configurada. Não existem credenciais inventadas no repositório.

## Observações

- A aplicação é deterministicamente estática e não utiliza IA, APIs externas nem credenciais hardcoded.
- Os dados ficam guardados no browser do utilizador em `localStorage` para um MVP simples e de fácil teste.
