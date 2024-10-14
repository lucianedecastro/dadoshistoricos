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
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar dados.json');
                }
                return response.json();
            })
            .then(data => {
                dadosSelecao = data;
                console.log('Dados carregados:', dadosSelecao); // Verifique os dados carregados
                preencherFiltros();
                atualizarTabela();
            })
            .catch(error => console.error('Erro ao carregar dados:', error));
    }

    function preencherFiltros() {
        filtroAno.innerHTML = ''; // Limpa o filtro antes de preenchê-lo
        const anosUnicos = new Set(dadosSelecao.geral.map(item => item.Ano));

        // Adiciona opções ao filtro de ano
        anosUnicos.forEach(ano => {
            const option = document.createElement('option');
            option.value = ano;
            option.textContent = ano;
            filtroAno.appendChild(option);
        });

        console.log('Anos disponíveis:', Array.from(anosUnicos)); // Verifique os anos disponíveis
    }

    function filtrarDados(aba) {
        const anoSelecionado = filtroAno.value;

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
            [item.Ano, item.Competição, item.Resultado, item.Técnico, item["Seleções adversárias"]].forEach(valor => {
                const novaCelula = novaLinha.insertCell();
                novaCelula.textContent = valor;
            });
        });
    }

    function gerarGrafico(dados) {
        if (meuGrafico) {
            meuGrafico.destroy(); // Destrói o gráfico anterior, se existir
        }

        const labels = dados.map(item => item.Ano_1); // Rótulos do eixo X (anos)
        const data = dados.map(item => item.Jogos); // Corrigido o acesso à coluna Jogos

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
        const anoSelecionado = filtroAno.value;

        const dadosGeral = filtrarDados('geral');
        const dadosDesempenho = filtrarDados('desempenho');

        // Adiciona cabeçalho à tabela com os nomes das colunas corretas
        criarCabecalhoTabela(Object.keys(dadosGeral[0] || {}));

        // Mostra a tabela geral
        if (dadosGeral.length > 0) {
            criarLinhasTabela(dadosGeral);
            tabelaContainer.style.display = 'block';
        } else {
            tabelaContainer.style.display = 'none';
        }

        // Gera o gráfico de desempenho
        if (dadosDesempenho.length > 0) {
            gerarGrafico(dadosDesempenho);
            graficoContainer.style.display = 'block';
        } else {
            graficoContainer.style.display = 'none';
        }
    }

    // Chama a função para carregar os dados quando a página carregar
    carregarDados();

    // Adiciona ouvintes de eventos aos filtros
    filtroAno.addEventListener('change', atualizarTabela);
});
