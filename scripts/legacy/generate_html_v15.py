import os

def get_html_template(modalidade, valor_total_str, incluir_automacao_sga=False, incluir_menu_upgrade=False):
    valor_total = float(valor_total_str.replace(".", "").replace(",", "."))
    p30 = valor_total * 0.30
    p10 = valor_total * 0.10

    def fmt(v):
        return f"R$ {v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

    # Seção de Automação SGA e Governança (Cláusula 4)
    sga_section = ""
    if incluir_automacao_sga:
        sga_section = f"""
        <div class="no-split">
            <h2>4. DA GOVERNANÇA, AUTOMAÇÃO E IDPGC (MODALIDADE PREMIUM)</h2>
            <p>A modalidade <strong>Governança</strong> contempla a entrega de módulos exclusivos para alta performance institucional:</p>
            <div style="border: 1px solid #000; padding: 15px; background: #fdfdfd;">
                <ul style="margin: 0;">
                    <li><strong>Mala Direta Sistêmica (Automação SGA):</strong> Transposição automática dos dados de campo e financeiros para os formulários oficiais (PDF) do Instituto, eliminando preenchimento manual externo.</li>
                    <li><strong>Gestão de Identificadores (IDPGC):</strong> Módulo dedicado ao controle, vinculação e rastreabilidade do Identificador PGC em todos os lançamentos financeiros.</li>
                    <li><strong>Gestão Avançada de Lotes:</strong> Funcionalidade de processamento em massa de lançamentos, pagamentos e borderôs, otimizando o fluxo de trabalho dos Analistas e Financeiro.</li>
                    <li><strong>Compliance e Travas:</strong> Implementação do status "Autorizado com Pendência" e alertas impeditivos para lançamentos sem documentação validada.</li>
                </ul>
            </div>
        </div>
        """

    upgrade_html = ""
    if incluir_menu_upgrade:
        upgrade_html = f"""
        <div class="no-split" style="margin-top: 30px; border: 2px dashed #000; padding: 20px; background-color: #fff9f9;">
            <h2 style="color: #c0392b; border-left: 6px solid #c0392b; background-color: #fff1f0; font-size: 11pt; margin-top: 0;">ANEXO: MENU DE UPGRADES DE GOVERNANÇA</h2>
            <p style="font-size: 9pt;">A modalidade Operacional não contempla automação de formulários e travas proativas. Valores para upgrade:</p>
            <table>
                <tr style="background: #eee;"><th>Módulo</th><th>Descrição</th><th>Valor Avulso</th></tr>
                <tr><td>Automação Mala Direta</td><td>Preenchimento automático de PDFs.</td><td>{fmt(2500)}</td></tr>
                <tr><td>Gestão de Lotes</td><td>Lançamentos em massa.</td><td>{fmt(2000)}</td></tr>
                <tr><td>Inteligência e IDPGC</td><td>Rastreabilidade e Travas de Anexos.</td><td>{fmt(7500)}</td></tr>
                <tr style="font-weight: bold; background: #eee;"><td colspan="2" style="text-align: right;">TOTAL:</td><td>{fmt(12000)}</td></tr>
            </table>
        </div>
        """

    return f"""
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Contrato SIGGA v5 - {modalidade}</title>
    <style>
        @page {{
            size: A4;
            margin: 2cm;
        }}
        body {{
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.4;
            color: #000;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            text-align: justify;
            font-size: 10.5pt;
        }}
        h1 {{ text-align: center; font-size: 18pt; text-transform: uppercase; border-bottom: 4px solid #000; padding-bottom: 8px; margin-bottom: 20px; font-weight: bold; page-break-after: avoid; }}
        h2 {{ font-size: 12pt; margin-top: 25px; border-left: 8px solid #000; padding-left: 12px; background-color: #f2f2f2; padding-top: 5px; padding-bottom: 5px; font-weight: bold; text-transform: uppercase; page-break-after: avoid; }}

        .no-split {{ page-break-inside: avoid; break-inside: avoid; }}
        table {{ width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 9.5pt; page-break-inside: avoid; break-inside: avoid; }}
        th, td {{ border: 1px solid #000; padding: 8px; text-align: left; }}
        th {{ background-color: #eee; font-weight: bold; text-transform: uppercase; }}

        .parties {{ background: #fafafa; padding: 20px; border: 1px solid #000; margin-bottom: 20px; page-break-inside: avoid; }}
        .label {{ font-weight: bold; text-transform: uppercase; font-size: 8pt; color: #333; display: block; }}

        .total-box {{ border: 3px solid #000; padding: 15px; text-align: center; margin: 20px 0; background: #f9f9f9; font-size: 11pt; page-break-inside: avoid; }}
        .highlight-red {{ color: #d63031; font-weight: bold; }}

        .signature-section {{ margin-top: 100px; page-break-inside: avoid; break-inside: avoid; }}
        .signature-grid {{ display: flex; justify-content: space-between; margin-top: 100px; }}
        .signature-box {{ width: 45%; border-top: 2px solid #000; text-align: center; padding-top: 10px; font-weight: bold; font-size: 10pt; }}

        ul, ol {{ margin-bottom: 15px; }}
        li {{ margin-bottom: 5px; }}

        @media print {{
            body {{ width: 100%; margin: 0; padding: 0; border: none; }}
            .signature-grid {{ display: flex; flex-direction: row; flex-wrap: nowrap; }}
        }}
    </style>
</head>
<body>
    <h1>INSTRUMENTO PARTICULAR DE LICENCIAMENTO DE SOFTWARE (SaaS)</h1>
    <p style="text-align: center; font-weight: bold; font-size: 12pt; margin-bottom: 30px;">PROPOSTA TÉCNICA E COMERCIAL: ERP SIGGA V5 - MODALIDADE {modalidade.upper()}</p>

    <div class="parties">
        <p><span class="label">LICENCIANTE (CONTRATADO):</span>
        <strong>JOÃO VICTOR PASSOS</strong>, inscrito no CNPJ sob o nº <strong>66.290.033/0001-21</strong>.</p>

        <p><span class="label">LICENCIADA (CONTRATANTE):</span>
        <strong>INSTITUTO ACARIQUARA</strong>, inscrito no CNPJ sob o nº <strong>06.284.362/0001-38</strong>, com sede em Manaus/AM.</p>
    </div>

    <div class="no-split">
        <h2>1. DA NATUREZA DO PROJETO E TECNOLOGIAS</h2>
        <p>O <strong>SIGGA v5</strong> é uma aplicação de software baseada em nuvem (Web App), desenvolvida sob arquitetura escalável utilizando tecnologias modernas de mercado. O licenciamento é na modalidade SaaS.</p>
        <p><strong>Serviços Terceirizados:</strong> A hospedagem e o banco de dados serão realizados em infraestrutura gerenciada (ex: AWS/Supabase/Vercel). Os custos mensais destes serviços <strong>serão faturados diretamente à Licenciada</strong>, não estando inclusos no valor de implementação desta proposta.</p>
    </div>

    <div class="no-split">
        <h2>2. DOS NÍVEIS DE USUÁRIO E ESCOPOS DE ACESSO</h2>
        <ul>
            <li><strong>Gerente (Nível Master):</strong> Gestão integral de segurança, auditoria de logs, criação de novos usuários e configuração de parâmetros globais.</li>
            <li><strong>Analista (Nível Estratégico):</strong> Supervisão multimanual de projetos, validação de metas dos técnicos, dashboards de acompanhamento e homologação de lançamentos.</li>
            <li><strong>Financeiro (Nível Operacional):</strong> Gestão de tesouraria, cadastramento de favorecidos, busca funcional por CPF/CNPJ, emissão de borderôs e controle de IDPGC.</li>
            <li><strong>Técnico ATER (Nível de Campo):</strong> Inserção de dados sociais, cadastros de famílias beneficiárias e registro de metas físicas alcançadas.</li>
        </ul>
    </div>

    <div class="no-split">
        <h2>3. DO ESCOPO FUNCIONAL ESSENCIAL</h2>
        <p>O sistema contempla em sua base de implementação:</p>
        <ul>
            <li>Migração digital dos Blocos A ao F da planilha SIGGA FIN V4;</li>
            <li>Pesquisa funcional por CPF/CNPJ em módulos de pagamento e favorecidos;</li>
            <li>Geração de recibos vinculados a borderôs e campos de observação estruturados;</li>
            <li>Interface responsiva otimizada para operação técnica e gerencial.</li>
        </ul>
    </div>

    {sga_section}

    <div class="no-split">
        <h2>5. TERMOS DE SIGILO E DADOS (NDA/LGPD)</h2>
        <p><strong>Limpeza de Dados:</strong> A migração depende de dados validados e limpos entregues pela Licenciada. Inconsistências na origem não são de responsabilidade do Licenciante.</p>
        <p><strong>Confidencialidade:</strong> Sigilo mútuo sobre dados e arquitetura de software (PI do motor é do Licenciante).</p>
    </div>

    <div class="no-split">
        <h2>6. DO CRONOGRAMA DE INVESTIMENTO E PAGAMENTO</h2>
        <p>O faturamento do projeto seguirá o cumprimento dos marcos técnicos. O atraso no pagamento de qualquer etapa suspende imediatamente o cronograma.</p>
        <table>
            <thead><tr><th>MARCO DE ENTREGA</th><th>DATA ESTIMADA</th><th>VALOR DA PARCELA</th></tr></thead>
            <tbody>
                <tr><td><strong>Marco 0:</strong> Sinal e Setup de Arquitetura</td><td>01/05/2026</td><td>{fmt(p30)}</td></tr>
                <tr><td><strong>Entrega 1:</strong> Módulos Financeiros (Blocos A-F)</td><td>15/06/2026</td><td>{fmt(p30)}</td></tr>
                <tr><td><strong>Entrega 2:</strong> Módulos Analistas e Campo</td><td>01/08/2026</td><td>{fmt(p30)}</td></tr>
                <tr><td><strong>Aceite Final:</strong> Homologação e Lançamento</td><td>31/08/2026</td><td>{fmt(p10)}</td></tr>
            </tbody>
        </table>
        <div class="total-box">
            <strong>VALOR TOTAL DO INVESTIMENTO ({modalidade}): {fmt(valor_total)}</strong>
        </div>
    </div>

    {upgrade_html}

    <div class="signature-section">
        <p>Manaus/AM, ____ de ____________ de 2026.</p>
        <div class="signature-grid">
            <div class="signature-box">JOÃO VICTOR PASSOS<br>Licenciante</div>
            <div class="signature-box">INSTITUTO ACARIQUARA<br>Licenciada</div>
        </div>
    </div>
</body>
</html>
"""

# Geração v15 FINAL ESTRATÉGICA
with open("Contrato_Operacional_v15_FINAL.html", "w", encoding="utf-8") as f:
    f.write(get_html_template("Operacional", "46.000,00", incluir_menu_upgrade=True))

with open("Contrato_Governanca_v15_FINAL.html", "w", encoding="utf-8") as f:
    f.write(get_html_template("Governança", "58.000,00", incluir_automacao_sga=True))

print("Contratos v15 (Estratégia de Preço no Final e Espaço para Gov.br) gerados com sucesso!")
