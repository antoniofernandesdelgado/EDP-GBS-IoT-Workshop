# NTT DATA · IoT Ideation Buddy

Experiência estática e responsiva para uma conversa de ideação IoT em português de Portugal. O participante percorre sete capítulos — **YOU, YOUR WORLD, YOUR PLATFORM, ANOTHER WORLD, BREAK THE IDEA, EDP e YOUR BET** — e termina com um IoT Radar e uma Opportunity Card padronizada.

## Funcionalidades

- Experiência conversacional de 8–12 minutos, centrada primeiro no mundo físico
- Seis achievement signals desbloqueáveis (01–06)
- Opportunity Card dinâmica com sinal, pessoa, fricção, primeiro passo e ganho
- IoT Radar final com indicadores de fricção humana, sinais, ação, energia e prontidão
- Estilo visual NTT DATA, sem branding EDP
- Persistência local em `localStorage`
- Mensagens de sincronização pendente e retry local
- Vista estática `/admin` com sinais agregados, radars individuais e exportação CSV
- Limite de configuração para integração opcional com Supabase em `static/js/config.js`

## Como testar localmente

1. Abra um terminal na pasta do projeto.
2. Execute:
   - `npm start`
3. Aceda a:
   - `http://localhost:4173/` para a experiência IoT Ideation Buddy
   - `http://localhost:4173/admin/` para a vista de resultados/facilitador

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
- Para ver resultados no `/admin`, use o mesmo browser/perfil onde completou a conversa, porque a persistência local é por origem.
