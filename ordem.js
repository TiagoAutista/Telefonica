let ordens = JSON.parse(localStorage.getItem('ordens')) || []; // Carregar ordens do Local Storage
let ordemAtualIndex = 0; // Índice da ordem atual a ser exibida
const modal = document.getElementById("modal");
const modalOrdem = document.getElementById("modal-ordem");

// Função para salvar ordens no Local Storage
function saveOrdens() {
    localStorage.setItem('ordens', JSON.stringify(ordens));
}

// Função para remover ordens duplicadas
function removeDuplicatas() {
    const ordensUnicas = [];
    const ordensSet = new Set();

    ordens.forEach(item => {
        if (!ordensSet.has(item.ordem)) {
            ordensSet.add(item.ordem);
            ordensUnicas.push(item);
        }
    });

    ordens = ordensUnicas; // Atualiza o array com ordens únicas
    saveOrdens(); // Salva a nova lista no Local Storage
    renderOrdens(); // Renderiza as ordens atualizadas
}

// Cadastrar Nova Ordem
document.getElementById('add-button').addEventListener('click', () => {
    const novaOrdem = document.getElementById('nova-ordem').value.trim();
    if (novaOrdem) {
        ordens.push({ ordem: novaOrdem, feito: false }); // Adicionado campo "feito"
        document.getElementById('nova-ordem').value = ''; // Limpar o campo de entrada
        removeDuplicatas(); // Remove duplicatas após adicionar
    } else {
        alert("Por favor, insira uma matrícula válida.");
    }
});

// Importar Ordens de um JSON
document.getElementById('import-button').addEventListener('click', () => {
    document.getElementById('json-file-input').click();
});

document.getElementById('json-file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target.result);
            ordens = jsonData;
            removeDuplicatas(); // Remover duplicatas após importar
            document.getElementById('export-button').style.display = 'block'; // Mostrar o botão de exportar
        } catch (error) {
            alert("Erro ao importar o arquivo JSON: " + error.message);
        }
    };

    reader.readAsText(file);
});

// Renderizar Ordens
function renderOrdens() {
    const container = document.getElementById('ordens-container');
    container.innerHTML = ''; // Limpar o container antes de renderizar

    ordens.forEach((item, index) => {
        const ordemItem = document.createElement('div');
        ordemItem.classList.add('ordem-item');

        const ordemLabel = document.createElement('span');
        ordemLabel.textContent = item.ordem;
        ordemLabel.classList.add('ordem-text');

        // Sinalizar que a ordem foi feita
        if (item.feito) {
            ordemLabel.style.textDecoration = "line-through"; // Riscar o texto se a ordem foi feita
            ordemLabel.style.color = "gray"; // Mudar a cor para indicar que está feita
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit-button');
        editButton.onclick = () => editOrdem(index);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Deletar';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = () => deleteOrdem(index);

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        ordemItem.appendChild(ordemLabel);
        ordemItem.appendChild(buttonContainer);
        container.appendChild(ordemItem); // Adiciona o item de ordem ao container
    });
}

// Editar Ordem
function editOrdem(index) {
    const newValue = prompt("Editar ordem:", ordens[index].ordem);
    if (newValue) {
        ordens[index].ordem = newValue; // Atualizar ordem
        renderOrdens(); // Renderizar novamente as ordens
        saveOrdens(); // Salvar as ordens no Local Storage
    }
}

// Deletar Ordem
function deleteOrdem(index) {
    ordens.splice(index, 1); // Remove a ordem do array
    renderOrdens(); // Renderiza as ordens atualizadas
    saveOrdens(); // Salvar as ordens no Local Storage
}

// Mostrar o modal com a ordem atual
function mostrarModal(ordem) {
    modalOrdem.textContent = ordem;
    modal.style.display = "block";
}

// Fechar o modal
function fecharModal() {
    modal.style.display = "none";
}

// Concluindo a ordem atual
function concluirOrdemAtual() {
    if (ordemAtualIndex < ordens.length) {
        ordens[ordemAtualIndex].feito = true; // Define a ordem atual como feita
        renderOrdens(); // Atualiza a lista de ordens cadastradas
        saveOrdens(); // Salva as ordens atualizadas no Local Storage
        ordemAtualIndex++; // Avança para a próxima ordem
        
        if (ordemAtualIndex < ordens.length) {
            mostrarModal(ordens[ordemAtualIndex].ordem); // Exibe a próxima ordem
        } else {
            alert("Todas as ordens foram concluídas!");
            ordemAtualIndex = 0; // Reinicia o índice para o próximo ciclo
            fecharModal(); // Fecha o modal
        }
    }
}

// Gerar nova ordem ao clicar no botão
document.getElementById('sequencial-button').addEventListener('click', () => {
    if (ordemAtualIndex < ordens.length) {
        mostrarModal(ordens[ordemAtualIndex].ordem); // Mostra a ordem atual
        document.getElementById('concluir-button').style.display = "block"; // Mostra o botão de concluir
    } else {
        alert("Não há ordens cadastradas.");
    }
});

// Concluir a ordem atual
document.getElementById('confirm-button').addEventListener('click', concluirOrdemAtual);

// Modal: ação de fechamento
document.querySelector('.close').addEventListener('click', fecharModal);

// Fechar o modal ao clicar fora do conteúdo
window.onclick = function(event) {
    if (event.target === modal) {
        fecharModal();
    }
};

// Funcionalidade para exportar ordens para um JSON
document.getElementById('export-button').addEventListener('click', () => {
    const jsonStr = JSON.stringify(ordens, null, 2); // Converter ordens para JSON
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ordens.json'; // Nome do arquivo de download
    a.click();
    URL.revokeObjectURL(url);
});

// Apagar Todas as Ordens
document.getElementById('clear-button').addEventListener('click', () => {
    if (confirm("Tem certeza que deseja apagar todas as ordens?")) {
        ordens = []; // Limpar o array de ordens
        renderOrdens(); // Renderiza as ordens atualizadas (nenhuma)
        saveOrdens(); // Limpeza no Local Storage
        document.getElementById('export-button').style.display = 'none'; // Esconder botão de exportar
    }
});

// Inicializar as ordens ao carregar a página
renderOrdens();
