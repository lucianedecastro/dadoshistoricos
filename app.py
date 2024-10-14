from flask import Flask, render_template, jsonify, send_from_directory
import json

app = Flask(__name__)

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
    return send_from_directory('.', 'dados.json')

if __name__ == "__main__":
    app.run(debug=True)