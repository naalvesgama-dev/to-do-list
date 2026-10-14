const input = document.getElementById("input-tarefa");
const botao = document.querySelector("#btn-adicionar");
const lista = document.querySelector("#lista-tarefas");
const filtroTodos = document.querySelector("#filtro-todos");
const filtroPendentes = document.querySelector("#filtro-pendentes");
const filtroConcluidas = document.querySelector("#filtro-concluidas");
const contador = document.querySelector("#contador");

let tarefas = [];
let filtroAtual = "todos";

const tarefasSalvas = localStorage.getItem("tarefas");

if (tarefasSalvas) {
  tarefas = JSON.parse(tarefasSalvas);
}

mostrarTarefas("todos");

function criarTarefa(tarefa) {
  const novaTarefa = document.createElement("li");
  novaTarefa.classList.add("tarefa");

  const textoTarefa = document.createElement("span");
  textoTarefa.textContent = tarefa.texto;
  textoTarefa.classList.add("texto-tarefa");

  const botaoEditar = document.createElement("button");
  botaoEditar.textContent = "Editar";
  botaoEditar.classList.add("btn-editar");

  const botaoExcluir = document.createElement("button");
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.classList.add("btn-excluir");

  if (tarefa.concluida) {
    novaTarefa.classList.add("concluida");
  }

  novaTarefa.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") {
      return;
    }

    tarefa.concluida = !tarefa.concluida;
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    mostrarTarefas(filtroAtual);
  });

  botaoEditar.addEventListener("click", function (event) {
    event.stopPropagation();

    if (botaoEditar.textContent === "Editar") {
      const inputEdicao = document.createElement("input");
      inputEdicao.value = tarefa.texto;
      inputEdicao.classList.add("input-edicao");

      textoTarefa.replaceWith(inputEdicao);
      botaoEditar.textContent = "Salvar";

      const botaoCancelar = document.createElement("button");
      botaoCancelar.textContent = "Cancelar";
      botaoCancelar.classList.add("btn-cancelar");

      botaoCancelar.addEventListener("click", function (e) {
        e.stopPropagation();
        inputEdicao.replaceWith(textoTarefa);
        botaoEditar.textContent = "Editar";
        botaoCancelar.remove();
      });

      novaTarefa.appendChild(botaoCancelar);
      inputEdicao.focus();

      botaoEditar.inputEdicao = inputEdicao;
    } else {
      const inputEdicao = botaoEditar.inputEdicao;
      const novoTexto = inputEdicao.value.trim();

      if (novoTexto === "") {
        inputEdicao.focus();
        return;
      }

      tarefa.texto = novoTexto;
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
      mostrarTarefas(filtroAtual);
    }
  });

  botaoExcluir.addEventListener("click", function (event) {
    event.stopPropagation();

    const indice = tarefas.indexOf(tarefa);
    if (indice !== -1) {
      tarefas.splice(indice, 1);
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
      mostrarTarefas(filtroAtual);
    }
  });

  novaTarefa.appendChild(textoTarefa);
  novaTarefa.appendChild(botaoEditar);
  novaTarefa.appendChild(botaoExcluir);
  lista.appendChild(novaTarefa);
}

function atualizarContador() {
  const pendentes = tarefas.filter(function (tarefa) {
    return !tarefa.concluida;
  });

  if (pendentes.length === 0) {
    contador.textContent = "Você concluiu todas as tarefas!";
  } else if (pendentes.length === 1) {
    contador.textContent = "Você tem 1 tarefa pendente";
  } else {
    contador.textContent = `Você tem ${pendentes.length} tarefas pendentes`;
  }
}

function mostrarTarefas(filtro) {
  filtroAtual = filtro;

  filtroTodos.classList.remove("ativo");
  filtroPendentes.classList.remove("ativo");
  filtroConcluidas.classList.remove("ativo");

  if (filtro === "todos") {
    filtroTodos.classList.add("ativo");
  } else if (filtro === "pendentes") {
    filtroPendentes.classList.add("ativo");
  } else if (filtro === "concluidas") {
    filtroConcluidas.classList.add("ativo");
  }

  lista.innerHTML = "";

  tarefas.forEach(function (tarefa) {
    if (filtro === "todos") {
      criarTarefa(tarefa);
    } else if (filtro === "pendentes" && !tarefa.concluida) {
      criarTarefa(tarefa);
    } else if (filtro === "concluidas" && tarefa.concluida) {
      criarTarefa(tarefa);
    }
  });

  atualizarContador();
}

filtroTodos.addEventListener("click", function () {
  mostrarTarefas("todos");
});

filtroPendentes.addEventListener("click", function () {
  mostrarTarefas("pendentes");
});

filtroConcluidas.addEventListener("click", function () {
  mostrarTarefas("concluidas");
});

botao.addEventListener("click", function () {
  const texto = input.value.trim();

  if (texto === "") {
    return;
  }

  tarefas.push({
    texto: texto,
    concluida: false
  });

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  mostrarTarefas(filtroAtual);

  input.value = "";
  input.focus();
});
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    botao.click();
  }
});