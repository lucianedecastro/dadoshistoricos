from flask import Flask, render_template, jsonify, send_from_directory
import json

app = Flask(__name__)

# Habilita o serviço de arquivos estáticos
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Desabilita o cache durante o desenvolvimento
app.static_folder = 'static'
app.config['APPLICATION_ROOT'] = '/data-coach'  # Define a URL base da aplicação

@app.route("/")
def index():
    return render_template("index.html")

# Carrega todos os dados do JSON para o frontend
@app.route('/dados.json')
def get_dados_json():
    with open('dados.json', 'r') as f:
        data = json.load(f)
    return jsonify(data)

# Filtra os dados por ano e retorna o filtro de geral e desempenho
@app.route('/filtrar_dados/<int:ano>')
def filtrar_dados(ano):
    with open('dados.json', 'r') as f:
        data = json.load(f)

    # Filtra os dados de "geral" e "desempenho" com base no ano selecionado
    geral = [item for item in data["geral"] if item["Ano"] == ano]
    desempenho = [item for item in data["desempenho"] if item["Ano_1"] == ano]

    # Retorna os dados filtrados
    return jsonify({
        "geral": geral,
        "desempenho": desempenho
    })

# Rota para servir arquivos estáticos
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == "__main__":
    app.run(debug=True)
