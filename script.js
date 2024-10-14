document.addEventListener('DOMContentLoaded', () => {
    const filtroAno = document.getElementById('filtroAno');
    const filtroCompeticao = document.getElementById('filtroCompeticao');
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
            })
            .catch(error => console.error('Erro ao carregar dados:', error));
    }

    function preencherFiltros() {
        const anosUnicos = new Set(dadosSelecao.geral.map(item => item.Ano));
        const competicoesUnicas = new Set(dadosSelecao.geral.map(item => item.Competição));

        anosUnicos.forEach(ano => {
            filtroAno.innerHTML += `<option value="${ano}">${ano}</option>`;
        });

        competicoesUnicas.forEach(competicao => {
            filtroCompeticao.innerHTML += `<option value="${competicao}">${competicao}</option>`;
        });
    }

    function filtrarDados(aba) {
        const anoSelecionado = parseInt(filtroAno.value, 10) || null;
        const competicaoSelecionada = filtroCompeticao.value;

        return dadosSelecao[aba].filter(item => {
            const atendeFiltroAno = !anoSelecionado || item.Ano === anoSelecionado;
            const atendeFiltroCompeticao = !competicaoSelecionada || item.Competição === competicaoSelecionada;
            return atendeFiltroAno && atendeFiltroCompeticao;
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
        const corpoTabela = document.querySelector('#tabela-container table tbody');
        if (!corpoTabela) {
            const tabela = document.querySelector('#tabela-container table');
            const novoCorpo = tabela.createTBody();
            dados.forEach(item => {
                const novaLinha = novoCorpo.insertRow();
                Object.values(item).forEach(valor => {
                    const novaCelula = novaLinha.insertCell();
                    novaCelula.textContent = valor;
                });
            });
        } else {
            corpoTabela.innerHTML = ''; 
            dados.forEach(item => {
                const novaLinha = corpoTabela.insertRow();
                Object.values(item).forEach(valor => {
                    const novaCelula = novaLinha.insertCell();
                    novaCelula.textContent = valor;
                });
            });
        }
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

    function atualizarTabela(aba) {
        const dadosFiltrados = filtrarDados(aba);

        if (dadosFiltrados.length > 0) {
            criarCabecalhoTabela(Object.keys(dadosFiltrados[0] || {}));
            criarLinhasTabela(dadosFiltrados);
            tabelaContainer.style.display = 'block';

            // Gera o gráfico apenas para a aba "detalhado"
            if (aba === 'detalhado') {
                gerarGrafico(dadosFiltrados);
                graficoContainer.style.display = 'block'; 
            } else {
                graficoContainer.style.display = 'none';
            }
        } else {
            tabelaContainer.style.display = 'none';
            graficoContainer.style.display = 'none';
        }
    }

    // Carrega os dados e preenche os filtros
    carregarDados();

    // Adiciona ouvintes de eventos aos filtros
    filtroAno.addEventListener('change', () => atualizarTabela('geral'));
    filtroCompeticao.addEventListener('change', () => atualizarTabela('geral'));
});