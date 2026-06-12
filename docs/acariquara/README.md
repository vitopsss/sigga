# Acariquara / SIGGATER Web

Este diretorio concentra a documentacao comercial, funcional e tecnica do trabalho com o Instituto Acariquara.

## Pastas

- `contratacao/`: propostas, contrato, e-mails formais, analises comerciais e material de apoio para negociacao.
- `contratacao/analise-societaria/`: documentos sobre adequacao societaria e tributaria.
- `arquitetura/`: documentos C4 e decisoes tecnicas de alto nivel do modulo.
- `planejamento/`: backlog, mapa funcional, plano de proximos passos e campos de MVP.
- `reunioes/`: roteiros, resumos e PDFs usados em reunioes com o Instituto.
- `fontes-oficiais/`: modelos e formularios enviados pelo Instituto.

## Arquivos principais

- Proposta revisada: `contratacao/Proposta_Tecnica_Comercial_SIGGATER_Web_Fase_1_Revisada.pdf`
- Contrato inicial: `contratacao/Contrato_SIGGATER_ATERSOCIOBIO_Fase_1.pdf`
- Mapa funcional atual: `planejamento/08-mapa-funcional-pos-reuniao-25-05.md`
- Backlog da Fase 1: `planejamento/03-backlog-fase-1.md`
- C4 contexto: `arquitetura/01-c4-contexto.md`
- C4 containers: `arquitetura/02-c4-containers.md`

## Geracao de PDFs

Os geradores ficam em `scripts/acariquara/`.

Comandos uteis:

```bash
npm run docs:acariquara:proposta-revisada
npm run docs:acariquara:contrato
npm run docs:acariquara:reuniao
npm run docs:acariquara:roteiro
npm run docs:acariquara:analise-escopo
```
