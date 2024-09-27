const tabuleiro = ['', '', '', '', '', '', '', '', ''];
let jogadorAtual = 'X';
let jogando = true;

const combinacoesVencedoras = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Colunas
    [0, 4, 8], [2, 4, 6]              // Diagonais
];

const tabuleiroDiv = document.getElementById('tabuleiro');
const statusDiv = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const cells = document.querySelectorAll('.cell');

function exibirTabuleiro() {
    tabuleiro.forEach((valor, index) => {
        cells[index].textContent = valor;
    });
}

function verificarVencedor(jogador) {
    return combinacoesVencedoras.some(combinacao => {
        return combinacao.every(index => {
            return tabuleiro[index] === jogador;
        });
    });
}

function reiniciarJogo() {
    tabuleiro.fill('');
    jogadorAtual = 'X';
    jogando = true;
    statusDiv.textContent = '';
    exibirTabuleiro();
}

tabuleiroDiv.addEventListener('click', (e) => {
    const index = e.target.getAttribute('data-index');
    if (tabuleiro[index] === '' && jogando) {
        tabuleiro[index] = jogadorAtual;
        exibirTabuleiro();
        if (verificarVencedor(jogadorAtual)) {
            statusDiv.textContent = `Parabéns, jogador ${jogadorAtual}! Você venceu!`;
            jogando = false;
        } else if (tabuleiro.every(cell => cell !== '')) {
            statusDiv.textContent = "Empate! Ninguém venceu.";
            jogando = false;
        } else {
            jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
        }
    }
});

resetBtn.addEventListener('click', reiniciarJogo);

exibirTabuleiro();
