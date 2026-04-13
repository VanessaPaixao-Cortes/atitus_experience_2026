const CODIGOS_CORRETOS = {
    codigo1: 'A17X',
    codigo2: 'B09K',
    codigo3: 'C44P',
    codigo4: 'D31Z'
};

const campos = ['codigo1', 'codigo2', 'codigo3', 'codigo4'];

const statusBox = document.getElementById('statusBox');
const statusMessage = document.getElementById('statusMessage');
const videoWrapper = document.getElementById('videoWrapper');
const videoFinal = document.getElementById('videoFinal');
const successOverlay = document.getElementById('successOverlay');
const somValidacao = document.getElementById('somValidacao');

function normalizar(valor) {
    return valor.trim().toUpperCase();
}

function setStatus(tipo, mensagem) {
    statusBox.classList.remove('pending', 'success', 'error');
    statusBox.classList.add(tipo);
    statusMessage.textContent = mensagem;
}

async function tocarSomValidacao() {
    try {
        somValidacao.currentTime = 0;
        await somValidacao.play();
    } catch (erro) {
        console.warn('Não foi possível tocar o som automaticamente.', erro);
    }
}

async function tocarVideoFinal() {
    try {
        videoFinal.currentTime = 0;
        await videoFinal.play();
    } catch (erro) {
        console.warn('Não foi possível tocar o vídeo automaticamente.', erro);
    }
}

function esconderOverlay() {
    successOverlay.classList.remove('visible');
    successOverlay.setAttribute('aria-hidden', 'true');
}

function mostrarOverlayTemporario() {
    successOverlay.classList.add('visible');
    successOverlay.setAttribute('aria-hidden', 'false');

    window.setTimeout(() => {
        esconderOverlay();
        tocarVideoFinal();
    }, 2200);
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
        setStatus('pending', 'Preencha os quatro códigos para validar o sistema.');
        videoWrapper.classList.remove('visible');
        esconderOverlay();

        if (!videoFinal.paused) {
            videoFinal.pause();
            videoFinal.currentTime = 0;
        }

        return;
    }

    const tudoCorreto = campos.every((id) => preenchidos[id] === CODIGOS_CORRETOS[id]);

    if (tudoCorreto) {
        setStatus('success', 'Códigos validados com sucesso. Núcleo central reativado.');
        videoWrapper.classList.add('visible');
        tocarSomValidacao();
        mostrarOverlayTemporario();
    } else {
        setStatus('error', 'Combinação inválida. Verifique os códigos e tente novamente.');
        videoWrapper.classList.remove('visible');
        esconderOverlay();

        if (!videoFinal.paused) {
            videoFinal.pause();
            videoFinal.currentTime = 0;
        }
    }
}

function limparCampos() {
    for (const id of campos) {
        document.getElementById(id).value = '';
    }

    setStatus('pending', 'Aguardando inserção dos quatro códigos.');
    videoWrapper.classList.remove('visible');
    esconderOverlay();

    if (!videoFinal.paused) {
        videoFinal.pause();
        videoFinal.currentTime = 0;
    }

    if (!somValidacao.paused) {
        somValidacao.pause();
        somValidacao.currentTime = 0;
    }
}

document.getElementById('validarBtn').addEventListener('click', validarCodigos);
document.getElementById('limparBtn').addEventListener('click', limparCampos);

for (const id of campos) {
    document.getElementById(id).addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            validarCodigos();
        }
    });
}