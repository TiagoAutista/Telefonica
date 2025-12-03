let tecnicos = JSON.parse(localStorage.getItem('tecnicos')) || [];

function displayMessage(msg, type) {
    const el = document.getElementById('message');
    el.textContent = msg;
    el.className = type === 'success' ? 'message-success' : 'message-error';
}

function resetForm() {
    document.getElementById('clientForm').reset();
    document.getElementById('cancelEditBtn').style.display = 'none';
}

function displayTechnicians(techniciansList = tecnicos) {
    const tbody = document.querySelector('#clientList tbody');
    tbody.innerHTML = '';

    if (techniciansList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:12px;">Nenhum técnico encontrado.</td></tr>`;
    } else {
        techniciansList.forEach(tecnico => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${tecnico.pon}</td>
                <td>${tecnico.nome}</td>
                <td>${tecnico.telefone}</td>
                <td>${tecnico.regiao}</td>
                <td>${tecnico.dataCriacao}</td>
                <td>
                    <button class="main-button" onclick="iniciarEdicao('${tecnico.pon}')">Editar</button>
                    <span class="excluir-btn" onclick="excluirTecnico('${tecnico.pon}')">🗑️</span>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    updateTechnicianCount(); // Atualiza a contagem de técnicos
}

document.addEventListener('DOMContentLoaded', () => {
    tecnicos = JSON.parse(localStorage.getItem('tecnicos')) || [];
    displayTechnicians(); // Mostra técnicos carregados
    updateTechnicianCount(); // Atualiza a contagem inicial ao carregar a página
});

document.getElementById('clientForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const pon = document.getElementById('pon').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const regiao = document.getElementById('regiao').value.trim();
    const dataCriacao = document.getElementById('dataCriacao').value;

    if (pon && tecnicos.some(t => t.pon === pon)) {
        // Atualização do técnico existente
        tecnicos = tecnicos.map(t => t.pon === pon ? { pon, nome, telefone, regiao, dataCriacao } : t);
        displayMessage('Técnico atualizado com sucesso!', 'success');
    } else {
        // Cadastro de novo técnico
        if (tecnicos.some(t => t.pon === pon)) {
            displayMessage('Matrícula já cadastrada!', 'error');
            return;
        }
        tecnicos.push({ pon, nome, telefone, regiao, dataCriacao });
        displayMessage('Técnico cadastrado com sucesso!', 'success');
    }

    localStorage.setItem('tecnicos', JSON.stringify(tecnicos));
    resetForm();
    displayTechnicians();
});

document.getElementById('clearBtn').addEventListener('click', function () {
    if (confirm('Tem certeza de que deseja apagar todos os técnicos? Esta ação não pode ser desfeita.')) {
        localStorage.removeItem('tecnicos');
        tecnicos = [];
        resetForm();
        displayTechnicians();
        displayMessage('Todos os dados foram apagados.', 'success');
    }
});

document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('fileImport').click();
});

document.getElementById('fileImport').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
        try {
            const data = JSON.parse(reader.result);
            if (!Array.isArray(data)) throw new Error('Esperado um array.');

            const novos = data.filter(novo => {
                return novo.pon && novo.nome && novo.telefone && novo.regiao && novo.dataCriacao &&
                    !tecnicos.some(existente => existente.pon === novo.pon);
            });

            novos.forEach(novoTecnico => {
                tecnicos.push(novoTecnico);
            });

            localStorage.setItem('tecnicos', JSON.stringify(tecnicos));
            displayTechnicians();
            displayMessage(`Importado(s): ${novos.length} técnico(s) novo(s)!`, 'success');
        } catch (err) {
            displayMessage('Erro ao importar: ' + (err.message || 'Arquivo inválido'), 'error');
        }
    };
    reader.readAsText(file);
});

document.getElementById('exportBtn').addEventListener('click', function () {
    if (tecnicos.length === 0) {
        displayMessage('Não há dados para exportar.', 'error');
        return;
    }

    const blob = new Blob([JSON.stringify(tecnicos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tecnicos_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    displayMessage('Exportado com sucesso!', 'success');
});

function updateTechnicianCount() {
    const countElement = document.getElementById('countMessage');
    countElement.textContent = `Total de Técnicos Cadastrados: ${tecnicos.length}`;
}

document.getElementById('updateCountBtn').addEventListener('click', updateTechnicianCount);

function searchClient() {
    const searchTerm = document.getElementById('search').value.toLowerCase(); // Obtém o termo de busca
    const filteredTechnicians = tecnicos.filter(tecnico =>
        tecnico.pon.toLowerCase().includes(searchTerm) || // Verifica se a matrícula contém o termo de busca
        tecnico.nome.toLowerCase().startsWith(searchTerm) // Verifica se o nome começa com o termo de busca
    );
    displayTechnicians(filteredTechnicians); // Atualiza a exibição com os técnicos filtrados
}

// Adiciona evento de input ao campo de busca
document.getElementById('search').addEventListener('input', searchClient);

// Função para editar técnico
function iniciarEdicao(pon) {
    const tecnico = tecnicos.find(t => t.pon === pon);
    if (tecnico) {
        document.getElementById('pon').value = tecnico.pon;
        document.getElementById('nome').value = tecnico.nome;
        document.getElementById('telefone').value = tecnico.telefone;
        document.getElementById('regiao').value = tecnico.regiao;
        document.getElementById('dataCriacao').value = tecnico.dataCriacao;
        document.getElementById('cancelEditBtn').style.display = 'inline-block';

        // Remove o técnico da lista se estiver editando
        tecnicos = tecnicos.filter(t => t.pon !== pon);
    }
}

// Função para excluir técnico
function excluirTecnico(pon) {
    if (confirm('Tem certeza de que deseja excluir este técnico? Esta ação não pode ser desfeita.')) {
        tecnicos = tecnicos.filter(t => t.pon !== pon);
        localStorage.setItem('tecnicos', JSON.stringify(tecnicos));
        displayTechnicians();
        displayMessage('Técnico excluído com sucesso!', 'success');
    }
}

// Configurar o evento de clique no botão de cancelar edição
document.getElementById('cancelEditBtn').addEventListener('click', function () {
    resetForm();
});
