import openpyxl
import json

# Carrega a pasta de trabalho do Excel
workbook = openpyxl.load_workbook('Desempenho dos técnicos da seleção.xlsx')

# Cria o objeto dadosSelecao
dadosSelecao = {
    "geral": [],
    "desempenho": [],
    "detalhado": []
}

# Função para converter os dados de uma linha da planilha para um dicionário
def linha_para_dicionario(sheet, linha):
    dados = {}
    for coluna in range(1, sheet.max_column + 1):
        titulo_coluna = sheet.cell(row=1, column=coluna).value
        valor_celula = sheet.cell(row=linha, column=coluna).value
        dados[titulo_coluna] = valor_celula
    return dados

# Lê os dados da guia "Geral"
sheet_geral = workbook['Geral']
for linha in range(2, sheet_geral.max_row + 1):
    dadosSelecao["geral"].append(linha_para_dicionario(sheet_geral, linha))

# Lê os dados da guia "Desempenho"
sheet_desempenho = workbook['Desempenho']
for linha in range(2, sheet_desempenho.max_row + 1):
    dadosSelecao["desempenho"].append(linha_para_dicionario(sheet_desempenho, linha))

# Lê os dados da guia "Detalhado", apenas se "Jogos" for diferente de 0
sheet_detalhado = workbook['Detalhado']
for linha in range(2, sheet_detalhado.max_row + 1):
    if sheet_detalhado.cell(row=linha, column=sheet_detalhado.max_column).value != 0:  # Verifica se "Jogos" é diferente de 0
        dadosSelecao["detalhado"].append(linha_para_dicionario(sheet_detalhado, linha))

# Imprime os dados em formato JSON para um arquivo
with open('dados.json', 'w', encoding='utf-8') as f:
    json.dump(dadosSelecao, f, ensure_ascii=False, indent=4)