document.addEventListener('DOMContentLoaded', () => {
    const filtroAno = document.getElementById('filtroAno');
    const tabelaContainer = document.getElementById('tabela-container');
    const graficoContainer = document.getElementById('grafico-container');
    const graficoCanvas = document.getElementById('graficoDesempenho');
    let meuGrafico = null; // Variável para armazenar o gráfico
    let dadosSelecao = {}; // Variável para armazenar os dados carregados

    // Função para carregar os dados do arquivo JSON
    function carregarDados() {
        fetch('dados.json')
            .then(response => response.json())
            .then(data => {
                dadosSelecao = data;
                preencherFiltros();
                atualizarTabela();
            })
            .catch(error => console.error('Erro ao carregar dados:', error));
    }

    function preencherFiltros() {
        const anosUnicos = new Set(dadosSelecao.geral.map(item => item.Ano));

        anosUnicos.forEach(ano => {
            const option = document.createElement('option');
            option.value = ano;
            option.textContent = ano;
            filtroAno.appendChild(option);
        });
    }

    function filtrarDados(aba) {
        const anoSelecionado = parseInt(filtroAno.value, 10) || null;

        return dadosSelecao[aba].filter(item => {
            return !anoSelecionado || item.Ano === anoSelecionado;
        });
    }

    function criarCabecalhoTabela(colunas) {
        const tabela = document.createElement('table');
        const cabecalho = tabela.createTHead().insertRow();
        colunas.forEach(coluna => {
            const th = document.createElement('th');
            th.textContent = coluna;
            cabecalho.appendChild(th);
        });
        tabelaContainer.innerHTML = ''; 
        tabelaContainer.appendChild(tabela);
    }

    function criarLinhasTabela(dados) {
        const tabela = document.querySelector('#tabela-container table');
        const corpoTabela = tabela.createTBody();
        dados.forEach(item => {
            const novaLinha = corpoTabela.insertRow();
            Object.values(item).forEach(valor => {
                const novaCelula = novaLinha.insertCell();
                novaCelula.textContent = valor;
            });
        });
    }

    // Função para gerar o gráfico de barras
    function gerarGrafico(dados) {
        if (meuGrafico) {
            meuGrafico.destroy(); // Destrói o gráfico anterior, se existir
        }

        const labels = dados.map(item => item.Ano); // Rótulos do eixo X (anos)
        const data = dados.map(item => item.Jogos); // Valores do eixo Y (jogos)

        meuGrafico = new Chart(graficoCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Número de Jogos por Ano',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function atualizarTabela() {
        const dadosGeral = filtrarDados('geral');
        const dadosDesempenho = filtrarDados('desempenho');
        const dadosDetalhado = filtrarDados('detalhado').filter(item => item.Jogos !== 0);

        const dadosFiltrados = [...dadosGeral, ...dadosDesempenho, ...dadosDetalhado];

        if (dadosFiltrados.length > 0) {
            criarCabecalhoTabela(Object.keys(dadosFiltrados[0] || {}));
            criarLinhasTabela(dadosFiltrados);
            tabelaContainer.style.display = 'block';

            // Gera o gráfico apenas para a aba "desempenho"
            if (dadosDesempenho.length > 0) {
                gerarGrafico(dadosDesempenho);
                graficoContainer.style.display = 'block'; 
            } else {
                graficoContainer.style.display = 'none'; // Esconde o gráfico
            }
        } else {
            tabelaContainer.style.display = 'none'; // Esconde a tabela
            graficoContainer.style.display = 'none'; // Esconde o gráfico
        }
    }

    // Chama a função para carregar os dados quando a página carregar
    carregarDados();

    // Adiciona ouvintes de eventos aos filtros
    filtroAno.addEventListener('change', atualizarTabela);
});