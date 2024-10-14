document.addEventListener('DOMContentLoaded', () => {
    const filtroAno = document.getElementById('filtroAno');
    const tabelaContainer = document.getElementById('tabela-container');
    const graficoContainer = document.getElementById('grafico-container');
    const graficoCanvas = document.getElementById('graficoDesempenho');
    let meuGrafico = null; // Variável para armazenar o gráfico
    let dadosSelecao = {}; // Variável para armazenar os dados carregados

    // Função para carregar os dados do JSON
    async function carregarDados() {
        try {
            const response = await fetch('dados.json');
            dadosSelecao = await response.json();
            popularFiltroAno();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    // Função para popular o campo de filtro com os anos
    function popularFiltroAno() {
        const anos = new Set(); // Usamos um Set para evitar anos duplicados

        // Adiciona anos da seção "geral"
        dadosSelecao.geral.forEach(entry => {
            anos.add(entry.Ano);
        });

        // Limpa o campo de filtro antes de popular
        filtroAno.innerHTML = '<option value="" selected>Selecione um ano</option>';

        // Adiciona os anos como opções
        anos.forEach(ano => {
            const option = document.createElement('option');
            option.value = ano;
            option.textContent = ano;
            filtroAno.appendChild(option);
        });
    }

    // Função para atualizar a tabela com base no ano selecionado
    function atualizarTabela() {
        const anoSelecionado = filtroAno.value;
        tabelaContainer.innerHTML = ''; // Limpa o conteúdo atual

        if (anoSelecionado === '') {
            // Exibe mensagem se nenhum ano for selecionado
            tabelaContainer.innerHTML = '<p>Por favor, selecione um ano para ver os dados.</p>';
            return;
        }

        // Filtra os dados da seleção geral com base no ano
        const dadosFiltrados = dadosSelecao.geral.filter(entry => entry.Ano === anoSelecionado);

        if (dadosFiltrados.length === 0) {
            tabelaContainer.innerHTML = '<p>Nenhum dado encontrado para o ano selecionado.</p>';
            return;
        }

        // Cria a tabela
        const tabela = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Cabeçalhos da tabela
        const headers = ['Ano', 'Competição', 'Resultado', 'Técnico', 'Seleções adversárias'];
        const trHead = document.createElement('tr');
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        tabela.appendChild(thead);

        // Linhas da tabela
        dadosFiltrados.forEach(entry => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = entry[header];
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        tabela.appendChild(tbody);
        tabelaContainer.appendChild(tabela);
    }

    // Função para atualizar o gráfico de desempenho
    function atualizarGrafico() {
        const anoSelecionado = filtroAno.value;

        // Filtra os dados de desempenho verificando múltiplos campos de ano
        const dadosDesempenhoFiltrados = dadosSelecao.desempenho.filter(entry => 
            entry.Ano_1 == anoSelecionado || 
            entry.Ano_2 == anoSelecionado || 
            entry.Ano_3 == anoSelecionado || 
            entry.Ano_4 == anoSelecionado
        );

        if (dadosDesempenhoFiltrados.length === 0) {
            graficoContainer.innerHTML = '<p>Nenhum dado de desempenho disponível para o ano selecionado.</p>';
            return;
        }

        // Prepara os dados para o gráfico
        const labels = ['Vitórias', 'Derrotas', 'Empates'];
        const dadosGrafico = [
            dadosDesempenhoFiltrados[0].Vitórias,
            dadosDesempenhoFiltrados[0].Derrotas,
            dadosDesempenhoFiltrados[0].Empates
        ];

        // Destruir o gráfico anterior, se houver
        if (meuGrafico) {
            meuGrafico.destroy();
        }

        // Cria o novo gráfico
        meuGrafico = new Chart(graficoCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: `Desempenho em ${anoSelecionado}`,
                    data: dadosGrafico,
                    backgroundColor: ['green', 'red', 'blue'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Desempenho por ano'
                    }
                }
            }
        });
    }

    // Event listeners
    filtroAno.addEventListener('change', () => {
        atualizarTabela();
        atualizarGrafico(); // Adicionando a chamada para atualizar o gráfico
    });

    // Função para resetar a página ao clicar no header
    function resetarPagina() {
        filtroAno.value = ''; // Reseta o filtro de ano
        tabelaContainer.innerHTML = ''; // Limpa a tabela
        if (meuGrafico) {
            meuGrafico.destroy(); // Destrói o gráfico, se existir
        }
        graficoContainer.innerHTML = '<canvas id="graficoDesempenho"></canvas>';
        carregarDados(); // Recarrega os dados
    }

    // Vincula a função de reset ao clique no header
    document.querySelector('header a').addEventListener('click', (event) => {
        event.preventDefault();
        resetarPagina();
    });

    // Carrega os dados ao iniciar
    carregarDados();
});
