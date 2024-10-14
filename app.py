from flask import Flask, render_template, jsonify, send_from_directory
import json

app = Flask(__name__)

# Habilita o serviço de arquivos estáticos
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Desabilita o cache
app.static_folder = 'static'
app.config['APPLICATION_ROOT'] = '/data-coach' # Define a URL base da aplicação

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/anos")
def get_anos():
    with open('dados.json', 'r') as f:
        data = json.load(f)
    anos = sorted(set([item["Ano"] for item in data["geral"]]))
    return jsonify(anos) 

@app.route('/dados.json')
def get_dados_json():
    with open('dados.json', 'r') as f:
        data = json.load(f)
    return jsonify(data) # Retorna os dados como JSON

@app.route('/filtrar_dados/<int:ano>/<string:competicao>')
def filtrar_dados(ano, competicao):
    with open('dados.json', 'r') as f:
        data = json.load(f)

    # Filtrar dados
    geral = data["geral"]
    desempenho = data["desempenho"]
    detalhado = data["detalhado"]

    # Filtra a aba "geral"
    geral = [item for item in geral if item["Ano"] == ano and (competicao == "" or item["Competição"] == competicao)]
    
    # Filtra as outras abas (desempenho e detalhado)
    # ... (adicionar filtros para as outras abas, se necessário)

    return jsonify({"geral": geral, "desempenho": desempenho, "detalhado": detalhado})

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == "__main__":
    app.run(debug=True)