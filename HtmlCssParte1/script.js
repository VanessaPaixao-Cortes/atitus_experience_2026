const CODIGOS_CORRETOS = {
    codigo1: "1",
    codigo2: "2",
    codigo3: "3",
    codigo4: "4"
};

const campos = ["codigo1", "codigo2", "codigo3", "codigo4"];

const statusBox = document.getElementById("statusBox");
const statusMessage = document.getElementById("statusMessage");
const videoWrapper = document.getElementById("videoWrapper");
const videoFinal = document.getElementById("videoFinal");
const successOverlay = document.getElementById("successOverlay");
const somValidacao = document.getElementById("somValidacao");
const somAcesso = document.getElementById("somAcesso");
const systemClock = document.getElementById("systemClock");

let typingTimer = null;

function atualizarRelogio() {
    const agora = new Date();
    const hh = String(agora.getHours()).padStart(2, "0");
    const mm = String(agora.getMinutes()).padStart(2, "0");
    const ss = String(agora.getSeconds()).padStart(2, "0");
    systemClock.textContent = `${hh}:${mm}:${ss}`;
}

atualizarRelogio();
setInterval(atualizarRelogio, 1000);

function normalizar(valor) {
    return valor.trim().toUpperCase();
}

function typeStatus(texto) {
    if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
    }

    statusMessage.textContent = "";
    statusMessage.classList.add("typing");
    let i = 0;
    const velocidade = 26;

    typingTimer = setInterval(() => {
        statusMessage.textContent += texto.charAt(i);
        i += 1;

        if (i >= texto.length) {
            clearInterval(typingTimer);
            typingTimer = null;
            setTimeout(() => statusMessage.classList.remove("typing"), 300);
        }
    }, velocidade);
}

function setStatus(tipo, mensagem, digitar = true) {
    statusBox.classList.remove("pending", "success", "error");
    statusBox.classList.add(tipo);
    statusMessage.classList.remove("typing");

    if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
    }

    if (!digitar) {
        statusMessage.textContent = mensagem;
        return;
    }

    typeStatus(mensagem);
}

async function tocarSom(audio) {
    try {
        audio.currentTime = 0;
        await audio.play();
    } catch (erro) {
        console.warn("Não foi possível tocar o áudio automaticamente.", erro);
    }
}

async function tocarVideoFinal() {
    try {
        videoFinal.currentTime = 0;
        await videoFinal.play();
    } catch (erro) {
        console.warn("Não foi possível tocar o vídeo automaticamente.", erro);
    }
}

function esconderOverlay() {
    successOverlay.classList.remove("visible");
    successOverlay.setAttribute("aria-hidden", "true");
}

function mostrarOverlayTemporario() {
    successOverlay.classList.add("visible");
    successOverlay.setAttribute("aria-hidden", "false");

    setTimeout(() => {
        esconderOverlay();
        videoWrapper.classList.add("visible");
        tocarVideoFinal();
    }, 2600);
}

function resetarMidia() {
    videoWrapper.classList.remove("visible");
    esconderOverlay();

    if (!videoFinal.paused) {
        videoFinal.pause();
        videoFinal.currentTime = 0;
    }

    for (const audio of [somValidacao, somAcesso]) {
        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    }
}

function validarCodigos() {
    const preenchidos = {};
    let todosPreenchidos = true;

    for (const id of campos) {
        const valor = normalizar(document.getElementById(id).value);
        preenchidos[id] = valor;
        if (!valor) todosPreenchidos = false;
    }

    if (!todosPreenchidos) {
        resetarMidia();
        setStatus("pending", "Preencha os quatro códigos para validar o sistema.");
        return;
    }

    setStatus("pending", "Executando varredura de integridade dos códigos...");

    setTimeout(() => {
        const tudoCorreto = campos.every((id) => preenchidos[id] === CODIGOS_CORRETOS[id]);

        if (tudoCorreto) {
            setStatus("success", "Códigos validados com sucesso. Núcleo central reativado.");
            tocarSom(somValidacao);
            setTimeout(() => tocarSom(somAcesso), 650);
            mostrarOverlayTemporario();
        } else {
            resetarMidia();
            setStatus("error", "Combinação inválida. Verifique os códigos e tente novamente.");
        }
    }, 900);
}

function limparCampos() {
    for (const id of campos) {
        document.getElementById(id).value = "";
    }
    resetarMidia();
    setStatus("pending", "Aguardando inserção dos quatro códigos.");
}

document.getElementById("validarBtn").addEventListener("click", validarCodigos);
document.getElementById("limparBtn").addEventListener("click", limparCampos);

for (const id of campos) {
    document.getElementById(id).addEventListener("keydown", (event) => {
        if (event.key === "Enter") validarCodigos();
    });
}

setStatus("pending", "Aguardando inserção dos quatro códigos.", false);