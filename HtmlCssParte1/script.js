const CODIGOS = ['A17X', 'B09K', 'C44P', 'D31Z'];
let typingTimer = null;

function typeStatus(texto) {
    clearInterval(typingTimer);

    let i = 0;
    const el = document.getElementById("statusMessage");
    el.innerText = "";

    typingTimer = setInterval(() => {
        el.innerText += texto[i];
        i++;
        if (i >= texto.length) {
            clearInterval(typingTimer);
        }
    }, 30);
}

function validarCodigos() {
    const valores = [
        codigo1.value.toUpperCase(),
        codigo2.value.toUpperCase(),
        codigo3.value.toUpperCase(),
        codigo4.value.toUpperCase()
    ];

    if (valores.includes("")) {
        typeStatus("Preencha todos os códigos");
        return;
    }

    typeStatus("Validando sistema...");

    setTimeout(() => {
        if (JSON.stringify(valores) === JSON.stringify(CODIGOS)) {

            typeStatus("Acesso concedido");
            somValidacao.play();

            setTimeout(() => {
                somAcesso.play();
                overlay.classList.add("visible");

                setTimeout(() => {
                    overlay.classList.remove("visible");
                    videoWrapper.classList.add("visible");
                    videoFinal.play();
                }, 2000);

            }, 800);

        } else {
            typeStatus("Código inválido");
        }
    }, 800);
}

function limparCampos() {
    codigo1.value = "";
    codigo2.value = "";
    codigo3.value = "";
    codigo4.value = "";
    typeStatus("Aguardando códigos...");
}