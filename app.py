from flask import Flask, jsonify, request
from flask_cors import CORS
import pymongo
import os

app = Flask(__name__)
CORS(app)

# String de conexão do MongoDB Atlas (obtida da variável de ambiente)
mongodb_uri = os.environ.get("MONGODB_URI")

# Conectar ao MongoDB Atlas
client = pymongo.MongoClient(mongodb_uri)
db = client.get_database("dadoshistoricos") # Substitua pelo nome do seu banco de dados

# Rota para buscar dados de todas as abas, filtrando por ano
@app.route('/api/dados/<int:ano>')
def api_dados(ano):
    # Buscar dados da collection "geral"
    geral = list(db["geral"].find({"Ano": ano}))

    # Buscar dados da collection "desempenho"
    desempenho = list(db["desempenho"].find({
        "$or": [
            {"Ano_1": ano},
            {"Ano_2": ano},
            {"Ano_3": ano},
            {"Ano_4": ano}
        ]
    }))

    # Buscar dados da collection "detalhado", filtrando por "Jogos" diferente de zero
    detalhado = list(db["detalhado"].find({"Ano": ano, "Jogos": {"$ne": 0}}))

    # Combinar os dados das três collections
    dados = {
        "geral": geral,
        "desempenho": desempenho,
        "detalhado": detalhado
    }

    return jsonify(dados)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)