// Variável para monitorar se um popup está aberto
let popupOpen = false;

// Funções para abrir e fechar o Popup 1
function openPopup() {
  if (popupOpen) return; // Impede abrir mais de um popup ao mesmo tempo
  popupOpen = true; // Indica que um popup está aberto
  togglePopup("popup", "flex"); // Mostra o popup
}

function closePopup() {
  popupOpen = false; // Indica que o popup está fechado
  togglePopup("popup", "none"); // Esconde o popup
}

// Funções para abrir e fechar o Popup 2
function openPopup2() {
  if (popupOpen) return; // Impede abrir mais de um popup ao mesmo tempo
  popupOpen = true;
  togglePopup("popup2", "flex"); // Mostra o popup 2
}

function closePopup2() {
  popupOpen = false;
  togglePopup("popup2", "none"); // Esconde o popup 2
}

// Funções para abrir e fechar o Popup 3
function openPopup3() {
  if (popupOpen) return; // Impede abrir mais de um popup ao mesmo tempo
  popupOpen = true;
  togglePopup("popup3", "flex"); // Mostra o popup 3
}

function closePopup3() {
  popupOpen = false;
  togglePopup("popup3", "none"); // Esconde o popup 3
}

// Função para alternar a exibição do popup
function togglePopup(popupId, displayStyle) {
  const popup = document.getElementById(popupId);
  popup.style.display = displayStyle; // Define a visibilidade do popup
  popup.setAttribute("aria-hidden", displayStyle === "none" ? "true" : "false"); // Atualiza atributo de acessibilidade
}

// Função para alternar a exibição do popup

const abasAbertas = [];

function abrirNovaAba(url) {
  if (!url) return;
  const novaAba = window.open(url, "_blank");
  if (novaAba) abasAbertas.push(novaAba);
}

function showSuperAttack() {
  const overlay = document.getElementById("superAttackOverlay");
  overlay.style.opacity = "1";
  overlay.style.pointerEvents = "auto";
  setTimeout(() => {
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.style.pointerEvents = "none";
    }, 300);
  }, 1200); // Duração do GIF visível: ~1.2s
}

function abrirAtendimentoNext() {
  const pon = document.getElementById("filter-pon-next").value.trim();

  // Remover caracteres não numéricos do input
  const cpf = pon.replace(/\D/g, "");

  // Verifica se o campo está vazio
  if (!pon) {
    return alert("Por favor, insira o Pon.");
  }

  // Verifica se o CPF contém exatamente 11 dígitos
  if (cpf.length !== 11) {
    return alert("CPF inválido! O CPF deve conter exatamente 11 números.");
  }

  // Verifica se todos os dígitos são numéricos
  if (!/^\d{11}$/.test(cpf)) {
    return alert("CPF inválido! O CPF deve conter exatamente 11 números.");
  }

  showSuperAttack();

  // Aguarda 1.3 segundos antes de abrir a nova aba com o CPF
  setTimeout(
    () =>
      abrirNovaAba(
        `http://gps.redecorp.br/gps/atendimento/index.jsf?documento=${encodeURIComponent(
          cpf
        )}`
      ),
    1300
  );

  // Limpar o campo de entrada
  document.getElementById("filter-pon-next").value = "";
}

function abrirAtendimentoSiebel() {
  const pon = document.getElementById("filter-pon-siebel").value.trim();

  // Remover caracteres não numéricos do input
  const cnpj = pon.replace(/\D/g, "");

  // Verifica se o campo está vazio
  if (!pon) {
    return alert("Por favor, insira o Pon.");
  }

  // Verifica se o CNPJ contém exatamente 14 dígitos
  if (cnpj.length !== 14) {
    return alert("CNPJ inválido! O CNPJ deve conter exatamente 14 números.");
  }

  // Se chegou aqui, o CNPJ é válido
  showSuperAttack();

  // Aguarda 1.3 segundos antes de abrir a nova aba com o CNPJ
  setTimeout(
    () =>
      abrirNovaAba(
        `http://gpscrm.gvt.com.br/gps/crm/atendimento/index.jsf?documento=${encodeURIComponent(
          cnpj
        )}`
      ),
    1300
  );

  // Limpar o campo de entrada
  document.getElementById("filter-pon-siebel").value = "";
}

function abrirAtendimentoWFM() {
  const pon = document.getElementById("filter-pon-WFM").value.trim();
  if (!pon) return alert("Por favor, insira o Pon.");
  showSuperAttack();
  setTimeout(
    () =>
      abrirNovaAba(
        `http://appwfm.gvt.net.br/wfm-search/detalhesWorkOrder.xhtml?wo=${encodeURIComponent(
          pon
        )}`
      ),
    1300
  );
  document.getElementById("filter-pon-next").value = "";
}

function fecharLinks() {
  abasAbertas.forEach((aba) => {
    try {
      if (!aba.closed) aba.close();
    } catch (e) {
      console.warn("Não foi possível fechar uma aba:", e);
    }
  });
  abasAbertas.length = 0; // limpa o array
}

// Função de geração de descrição
document.getElementById("generateButton")?.addEventListener("click", () => {
  const input = document.getElementById("inputDados");
  const output = document.getElementById("resultado");

  if (!input || !output) return;

  const dataString = input.value.trim();
  if (!dataString) {
    output.innerHTML = '<p style="color: red;">Por favor, cole os dados!</p>';
    return;
  }

  const descricao = gerarDescricao(dataString);
  output.innerHTML = `<pre>${descricao}</pre>`;
});

function gerarDescricao(dataString) {
  const regexMap = {
    dataTabulacao: /Data Tabulação:\s*([^]*?)(?=\s*RE Colaborador:)/,
    colaboradorResponsavel:
      /Colaborador Responsável:\s*([^]*?)(?=\s*Ordem de Serviço:)/,
    ordemServico: /Ordem de Serviço:\s*([^]*?)(?=\s*Status Rota:)/,
    timeSlot: /Time Slot:\s*([^]*?)(?=\s*Servico:)/,
    servico: /Servico:\s*([^]*?)(?=\s*Nome do técnico:)/,
    nomeTecnico: /Nome do técnico:\s*([^]*?)(?=\s*Contato técnico:)/,
    tecnologia: /Tecnologia:\s*([^]*?)(?=\s*Cluster:)/,
    statusTratativa:
      /Status Tratativa:\s*([^]*?)(?=\s*Houve Contato com o Cliente:)/,
  };

  const dados = {};
  for (const [key, regex] of Object.entries(regexMap)) {
    const match = dataString.match(regex);
    dados[key] = match ? match[1].trim() : "não informado";
  }

  const dataFormatada = formatarData(dados.dataTabulacao);
  const servicoFormatado = formataServico(dados.servico);

  return `
Descrição do Chamado Técnico:

No dia ${
    dataFormatada || "data não informada"
  }, foi realizada a tabulação do chamado. O colaborador responsável por esse atendimento foi ${
    dados.colaboradorResponsavel
  }. O número da ordem de serviço é ${
    dados.ordemServico
  }, programada para um intervalo de execução de ${
    dados.timeSlot
  }. O serviço solicitado foi ${
    servicoFormatado || dados.servico
  }, e o técnico designado para a tarefa foi ${
    dados.nomeTecnico
  }. A tecnologia utilizada é ${
    dados.tecnologia
  }. O status da tratativa do chamado é: ${dados.statusTratativa}.

A equipe deve acompanhar o andamento desta solicitação e garantir que as ações necessárias sejam realizadas de forma eficaz.
      `.trim();
}

function formatarData(dataStr) {
  if (!dataStr) return null;
  const match = dataStr.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
  if (!match) return null;
  const data = new Date(match[0]);
  return data
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(" às ", " às ");
}

function formataServico(servicoStr) {
  if (!servicoStr || !servicoStr.includes("||")) return null;
  return servicoStr
    .split("||")
    .map((part) => part.split("-")[1]?.trim())
    .filter(Boolean)
    .join(" / ");
}

// Função para alternar a exibição do popup

// Simula verificação de sistemas (em produção, você faria requisições reais)
function checkSystemStatus() {
  const systems = {
    outlook: "https://outlook.office.com/mail/",
    successfactors: "https://performancemanager5.successfactors.eu/sf/home",
    nice: "https://vivowfm.redecorp.br/wfm/login?logout=true",
    vivopessoas: "https://rhtelefonica.zendesk.com/hc/pt-br",
    intranet: "https://intranet.telefonica.com.br/noticias",
  };

  // Como não podemos fazer requisições cross-origin facilmente, vamos simular:
  // Em ambiente real, você usaria um backend ou proxy para testar conectividade.
  Object.keys(systems).forEach((key) => {
    const el = document.getElementById(`status-${key}`);
    if (el) {
      // Simulação: 80% de chance de estar online
      const isOnline = Math.random() > 0.2;
      el.className = `system-item ${isOnline ? "online" : "offline"}`;
      el.textContent = isOnline ? el.textContent : `${el.textContent} ✘`;
    }
  });
}

// Executa ao carregar a página
window.addEventListener("load", checkSystemStatus);

function mudarTema(tema) {
  const root = document.documentElement;
  root.className = ""; // remove temas anteriores

  if (tema === "dark") {
    root.classList.add("dark-theme");
    localStorage.setItem("tema-kof", "dark");
  } else if (tema === "red") {
    root.classList.add("red-theme");
    localStorage.setItem("tema-kof", "red");
  } else {
    // tema padrão
    localStorage.setItem("tema-kof", "default");
  }
}

// Aplicar tema salvo ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  const temaSalvo = localStorage.getItem("tema-kof");
  if (temaSalvo) {
    mudarTema(temaSalvo);
  }
});

// Função para rolar suavemente para o topo da página
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Rolagem suave
  });
}

// Exibir ou ocultar o botão com base na rolagem da página
window.onscroll = function () {
  const button = document.querySelector(".back-to-top");
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    button.style.display = "block";
  } else {
    button.style.display = "none";
  }
};

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const clock = document.getElementById("clock");
  clock.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000); // Atualiza a cada segundo
updateClock(); // Chama a função uma vez para inicializar

function scrollToClock() {
  const clockSection = document.getElementById("relogio");
  clockSection.scrollIntoView({
    behavior: "smooth", // Rolagem suave
  });
}

document
  .getElementById("generateButton")
  .addEventListener("click", function () {
    const dataString = document.getElementById("inputDados").value;

    if (dataString.trim() === "") {
      document.getElementById("resultado").innerHTML =
        '<p style="color: red;">Por favor, cole os dados!</p>';
      return;
    }

    const descricao = gerarDescricao(dataString);
    document.getElementById("resultado").innerHTML = `<pre>${descricao}</pre>`;
  });

function gerarDescricao(dataString) {
  const regexMap = {
    dataTabulacao: /Data Tabulação:\s*([^]*?)(?=\s*RE Colaborador:)/,
    colaboradorResponsavel:
      /Colaborador Responsável:\s*([^]*?)(?=\s*Ordem de Serviço:)/,
    ordemServico: /Ordem de Serviço:\s*([^]*?)(?=\s*Status Rota:)/,
    timeSlot: /Time Slot:\s*([^]*?)(?=\s*Servico:)/,
    servico: /Servico:\s*([^]*?)(?=\s*Nome do técnico:)/,
    nomeTecnico: /Nome do técnico:\s*([^]*?)(?=\s*Contato técnico:)/,
    tecnologia: /Tecnologia:\s*([^]*?)(?=\s*Cluster:)/,
    statusTratativa:
      /Status Tratativa:\s*([^]*?)(?=\s*Houve Contato com o Cliente:)/,
  };

  const dadosExtraidos = {};

  for (const key in regexMap) {
    const match = dataString.match(regexMap[key]);
    dadosExtraidos[key] = match ? match[1].trim() : null;
  }

  // Formatar a data
  const dataFormatada = formatarData(dadosExtraidos.dataTabulacao);

  // Formatar o serviço
  const servicoFormatado = formataServico(dadosExtraidos.servico);

  // Gerando a descrição com base nos dados extraídos
  const descricao = `
Descrição do Chamado Técnico:<br>
No dia ${dataFormatada || "data não informada"},\n
foi realizada a tabulação do chamado.<br>
O colaborador responsável por esse atendimento foi: \n <br> ${
    dadosExtraidos.colaboradorResponsavel || "não informado"
  }.<br>
O número da ordem de serviço é ${
    dadosExtraidos.ordemServico || "não informado"
  }.<br>
No intervalo de execução das ${dadosExtraidos.timeSlot || "não informado"}.<br>
O serviço solicitado foi ${servicoFormatado || "não informado"},<br>
Técnico designado para a tarefa foi: \n <br> ${
    dadosExtraidos.nomeTecnico || "não informado"
  }.<br>
A tecnologia utilizada é ${dadosExtraidos.tecnologia || "não informada"}.<br>
O status da tratativa do chamado é: ${
    dadosExtraidos.statusTratativa || "não informado"
  }.<br>
A equipe deve acompanhar o andamento desta solicitação \n e garantir que as ações necessárias \n sejam realizadas de forma eficaz.
`;
  return descricao;
}

function formatarData(dataString) {
  const match = dataString.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
  if (!match) return null;

  const data = new Date(match[0]);
  const opções = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return data.toLocaleDateString("pt-BR", opções).replace(" às ", " às ");
}

function formataServico(servicoString) {
  if (!servicoString) return null;
  return servicoString
    .split("||")
    .map((serv) => serv.split("-")[1]?.trim())
    .filter(Boolean)
    .join(" / ");
}

function gerarRegistro() {
  const matricula = document.getElementById("matricula").value;
  const numeroCliente = document.getElementById("numeroCliente").value;
  const direcaoChamada = document.getElementById("direcaoChamada").value;
  const horarioChamada = document.getElementById("horarioChamada").value;
  const motivoCliente = document.getElementById("motivoCliente").value;

  const resultado = `Matrícula: ${matricula}
  Número do cliente: ${numeroCliente}
  Direção da chamada: ${direcaoChamada}
  Horário da chamada: ${horarioChamada}
  Motivo: ${motivoCliente}
  `;

  document.getElementById("output").innerText = resultado;
}

function copiarRegistro() {
  const output = document.getElementById("output").innerText;

  if (output) {
    navigator.clipboard.writeText(output).then(
      () => {},
      (err) => {
        console.error("Erro ao copiar: ", err);
      }
    );
  } else {
    alert("Não há registro para copiar!");
  }
}
function gerarDescricao() {
  const pon = document.getElementById("pon").value.trim();
  const cluster = document.getElementById("cluster").value.trim();
  const informada = document.getElementById("informada").value.trim();
  const motivo = document.getElementById("motivo").value.trim();
  const obs = document.getElementById("obs").value.trim();
  const facilidade = document.getElementById("facilidade").value.trim();

  const descricao = `
ORDEM NÃO INFORMADA:<br>
Pon: ${pon || "dados não informados"}<br>
Cluster: ${cluster || "dados não informados"}<br>
Solicitação da informada: ${informada || "dados não informados"}<br>
Motivo não informada: ${motivo || "dados não informados"}<br>
OBS: ${obs || "dados não informados"}<br>
POSSIBILIDADE DE FACILIDADE: ${facilidade || "dados não informados"}<br><br>
Foi orientado a escalonar sua gestão para interação e orientação no caso de não conseguir prosseguir com a informada.
`;

  document.getElementById("output").innerHTML = descricao; // Mudando para innerHTML para aceitar as quebras de linha
}

function copiarDescricao() {
  const output = document.getElementById("output").innerText;

  if (output) {
    navigator.clipboard.writeText(output).then(
      () => alert("Descrição copiada com sucesso!"),
      (err) => {
        console.error("Erro ao copiar: ", err);
      }
    );
  } else {
    alert("Não há registro para copiar!");
  }
}

