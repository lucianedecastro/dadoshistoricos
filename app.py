from flask import Flask, jsonify, request
from flask_cors import CORS
import gspread
from oauth2client.service_account import ServiceAccountCredentials

app = Flask(__name__)
CORS(app)

# Credenciais da API do Google (ajuste o caminho para o arquivo JSON)
scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name(r'C:\Users\lucia\desempenhotecnicosV2\disco-freedom-433500-h0-d619a1073895.json', scope) 
client = gspread.authorize(creds)

# Link da Planilha no Google Drive (substitua pelo seu link)
spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1qsUHg92SYqbpufM9nTIZuBhkNHmgM-uL/edit?usp=drive_link&ouid=111070395629463126436&rtpof=true&sd=true'

# Abrir a Planilha
spreadsheet = client.open_by_url(spreadsheet_url)

# Função para ler os dados de uma aba
def ler_dados_da_aba(aba_nome):
    worksheet = spreadsheet.worksheet(aba_nome)
    dados = worksheet.get_all_records()
    return dados

# Rota /api/geral
@app.route('/api/geral')
def api_geral():
    ano = request.args.get('ano')
    dados = ler_dados_da_aba('Geral')
    if ano:
        dados = [d for d in dados if d['Ano'] == int(ano)]
    return jsonify(dados)

# Rota /api/desempenho
@app.route('/api/desempenho')
def api_desempenho():
    ano = request.args.get('ano')
    dados = ler_dados_da_aba('Desempenho')
    if ano:
        dados = [d for d in dados if any(str(d.get(f'Ano_{i}')) == ano for i in range(1, 5))]
    return jsonify(dados)

# Rota /api/detalhado
@app.route('/api/detalhado')
def api_detalhado():
    ano = request.args.get('ano')
    dados = ler_dados_da_aba('Detalhado')
    if ano:
        dados = [d for d in dados if d['Ano'] == int(ano) and int(d.get('Jogos', 0)) != 0]
    return jsonify(dados)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)