const apiBaseUrl = 'https://dadoshistoricos.vercel.app/';  

// Função para buscar dados da API
async function buscarDados(ano) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/dados/${ano}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return null;
    }
}

// Função para criar tabela
function criarTabela(dados, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 

    if (!dados || dados.length === 0) {
        container.textContent = "Nenhum dado encontrado para este ano.";
        return;
    }

    const tabela = document.createElement('table');
    const cabecalho = tabela.createTHead();
    const linhaCabecalho = cabecalho.insertRow();

    Object.keys(dados[0]).forEach(titulo => {
        const celulaCabecalho = linhaCabecalho.insertCell();
        celulaCabecalho.textContent = titulo;
    });

    const corpoTabela = tabela.createTBody();
    dados.forEach(linha => {
        const linhaTabela = corpoTabela.insertRow();
        Object.values(linha).forEach(valor => {
            const celula = linhaTabela.insertCell();
            celula.textContent = valor;
        });
    });

    container.appendChild(tabela);
}

// Adiciona um evento de mudança ao filtro de ano
document.getElementById('filtroAno').addEventListener('change', async function() {
    const anoSelecionado = this.value;
    if (anoSelecionado) {
        const dados = await buscarDados(anoSelecionado);
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
    buscarDados('') // Busca todos os anos
        .then(dados => {
            if (dados) {
                const filtroAno = document.getElementById('filtroAno');
                const anosUnicos = new Set();
                dados.geral.forEach(item => anosUnicos.add(item.Ano));
                dados.desempenho.forEach(item => {
                    anosUnicos.add(item.Ano_1);
                    anosUnicos.add(item.Ano_2);
                    anosUnicos.add(item.Ano_3);
                    anosUnicos.add(item.Ano_4);
                });
                dados.detalhado.forEach(item => anosUnicos.add(item.Ano));
                anosUnicos.forEach(ano => {
                    const option = document.createElement('option');
                    option.value = ano;
                    option.text = ano;
                    filtroAno.add(option);
                });
            }
        });
});