let ordens = JSON.parse(localStorage.getItem('ordens')) || [];
let editing = null; // Variável para armazenar a ordem que está sendo editada

function displayMessage(msg, type) {
    const el = document.getElementById('message');
    el.textContent = msg;
    el.className = type === 'success' ? 'message-success' : 'message-error';
}

function resetForm() {
    document.getElementById('orderForm').reset();
    document.getElementById('cancelEditOrderBtn').style.display = 'none';
    editing = null; // Limpa a variável de edição
}

function displayOrders(ordersList = ordens) {
    const tbody = document.querySelector('#orderList tbody');
    tbody.innerHTML = '';

    if (ordersList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:12px;">Nenhuma ordem encontrada.</td></tr>`;
    } else {
        ordersList.forEach(ordem => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${ordem.ponOrdem}</td>
                <td>${ordem.tecnico}</td>
                <td>${ordem.descricao}</td>
                <td>${ordem.dataOrdem}</td>
                <td>${ordem.status}</td>
                <td>${ordem.cpfCnpj}</td>
                <td>
                    <button class="main-button" onclick="startEditing('${ordem.ponOrdem}')">Editar</button>
                    <span class="excluir-btn" onclick="deleteOrder('${ordem.ponOrdem}')">🗑️</span>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    updateOrderCount(); // Atualiza a contagem de ordens
}

document.addEventListener('DOMContentLoaded', () => {
    ordens = JSON.parse(localStorage.getItem('ordens')) || [];
    displayOrders(); // Mostra ordens carregadas
    updateOrderCount(); // Atualiza a contagem inicial ao carregar a página
});

document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const ponOrdem = document.getElementById('ponOrdem').value.trim();
    const tecnico = document.getElementById('tecnico').value.trim();
    const descricao = document.getElementById('descricao').value; // Agora pega o valor do select
    const dataOrdem = document.getElementById('dataOrdem').value;
    const status = document.getElementById('status').value; // Valor do select para o status
    const cpfCnpj = document.getElementById('cpfCnpj').value.trim();

    if (editing) {
        // Atualiza a ordem existente
        const index = ordens.findIndex(ordem => ordem.ponOrdem === editing);
        if (index > -1) {
            ordens[index] = { ponOrdem, tecnico, descricao, dataOrdem, status, cpfCnpj };
            localStorage.setItem('ordens', JSON.stringify(ordens));
            displayMessage('Ordem atualizada com sucesso!', 'success');
        }
    } else {
        // Adiciona nova ordem
        ordens.push({ ponOrdem, tecnico, descricao, dataOrdem, status, cpfCnpj });
        localStorage.setItem('ordens', JSON.stringify(ordens));
        displayMessage('Ordem cadastrada com sucesso!', 'success');
    }

    resetForm();
    displayOrders();
});

document.getElementById('updateCountOrderBtn').addEventListener('click', updateOrderCount);

function updateOrderCount() {
    const countElement = document.getElementById('countOrderMessage');
    countElement.textContent = `Total de Ordens Cadastradas: ${ordens.length}`;
}

function searchOrder() {
    const searchTerm = document.getElementById('searchOrder').value.toLowerCase(); // Obtém o termo de busca
    const filteredOrders = ordens.filter(ordem =>
        ordem.ponOrdem.toLowerCase().includes(searchTerm) || // Verifica se o PON contém o termo de busca
        ordem.descricao.toLowerCase().startsWith(searchTerm) || // Verifica se a descrição começa com o termo de busca
        ordem.cpfCnpj.includes(searchTerm) // Verifica se o CPF ou CNPJ contém o termo de busca
    );
    displayOrders(filteredOrders); // Atualiza a exibição com as ordens filtradas
}

// Função para iniciar a edição de uma ordem existente
function startEditing(ponOrdem) {
    const ordem = ordens.find(o => o.ponOrdem === ponOrdem);
    if (ordem) {
        document.getElementById('ponOrdem').value = ordem.ponOrdem;
        document.getElementById('tecnico').value = ordem.tecnico;
        document.getElementById('descricao').value = ordem.descricao;
        document.getElementById('dataOrdem').value = ordem.dataOrdem;
        document.getElementById('status').value = ordem.status;
        document.getElementById('cpfCnpj').value = ordem.cpfCnpj;
        document.getElementById('cancelEditOrderBtn').style.display = 'block';
        editing = ponOrdem; // Guarda o PON da ordem que está sendo editada
    }
}

// Função para excluir uma ordem existente
function deleteOrder(ponOrdem) {
    if (confirm('Tem certeza que deseja excluir esta ordem? Esta ação não pode ser desfeita.')) {
        ordens = ordens.filter(ordem => ordem.ponOrdem !== ponOrdem);
        localStorage.setItem('ordens', JSON.stringify(ordens));
        displayOrders();
        displayMessage('Ordem excluída com sucesso!', 'success');
    }
}
