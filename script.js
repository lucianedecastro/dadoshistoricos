const apiBaseUrl = 'https://dadoshistoricos.vercel.app/';

// Função para buscar dados da API com filtro de ano
async function buscarDados(endpoint, ano = "") {
    let url = `${apiBaseUrl}${endpoint}`;
    if (ano) {
        url += `/${ano}`;
    }

    try {
        const response = await fetch(url);
        const dados = await response.json();
        return dados;
    } catch (error) {
        console.error(`Erro ao buscar dados de ${endpoint}:`, error);
        return [];
    }
}

// Função para criar tabela
function criarTabela(dados, containerId) {
    // ... (código sem alterações) ...
}

// Adiciona um evento de mudança ao filtro de ano
document.getElementById('filtroAno').addEventListener('change', async function () {
    const anoSelecionado = this.value;
    if (anoSelecionado) {
        const dados = await buscarDados('/api/dados', anoSelecionado); // Corrigido: endpoint correto
        if (dados) {
            criarTabela(dados.geral, 'tabelaGeral');
            criarTabela(dados.desempenho, 'tabelaDesempenho');
            criarTabela(dados.detalhado, 'tabelaDetalhado');
        }
    } else {
        // Limpa as tabelas se "Todos" for selecionado
        document.getElementById('tabelaGeral').innerHTML = '';
        document.getElementById('tabelaDesempenho').innerHTML = '';
        document.getElementById('tabelaDetalhado').innerHTML = '';
    }
});

// Carrega os dados iniciais quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    // Lógica para popular o select do filtro de ano
    buscarDados('/api/dados') // Corrigido: endpoint correto
        .then(dados => {
            if (dados) {
                const filtroAno = document.getElementById('filtroAno');
                const anosUnicos = new Set();
                // ... (código para popular o filtro de ano) ...
            }
        });
});