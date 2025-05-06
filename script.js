const tabuleiro = ['', '', '', '', '', '', '', '', ''];
let jogadorAtual = 'X';
let jogando = true;
let scoreX = 0;
let scoreO = 0;
let isPvIA = false;

const combinacoesVencedoras = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
    [0, 4, 8], [2, 4, 6] // Diagonais
];

const tabuleiroDiv = document.getElementById('tabuleiro');
const statusDiv = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const toggleModeBtn = document.getElementById('toggleMode');
const scoreXSpan = document.getElementById('scoreX');
const scoreOSpan = document.getElementById('scoreO');
const cells = document.querySelectorAll('.cell');

function inicializarJogo() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner');
    });
    statusDiv.textContent = `Vez do jogador: ${jogadorAtual}`;
    resetBtn.addEventListener('click', reiniciarJogo);
    toggleModeBtn.addEventListener('click', toggleMode);
}

function handleCellClick(e) {
    if (isPvIA && jogadorAtual === 'O') return; // Bloqueia clique humano no turno da IA
    const index = e.target.dataset.index;
    if (tabuleiro[index] !== '' || !jogando) return;

    jogar(index, jogadorAtual);
    if (isPvIA && jogando && jogadorAtual === 'O') {
        setTimeout(jogadaIA, 500); // Pequeno delay para simular "pensamento" da IA
    }
}

function jogar(index, jogador) {
    tabuleiro[index] = jogador;
    cells[index].textContent = jogador;
    cells[index].classList.add(jogador.toLowerCase());

    const resultado = verificarResultado();
    if (resultado.vencedor) {
        destacarVitoria(resultado.combinacao);
        atualizarPlacar();
        statusDiv.textContent = `Jogador ${jogador} venceu!`;
        jogando = false;
    } else if (resultado.empate) {
        statusDiv.textContent = 'Empate! Ninguém venceu.';
        jogando = false;
    } else {
        jogadorAtual = jogador === 'X' ? 'O' : 'X';
        statusDiv.textContent = `Vez do jogador: ${jogadorAtual}`;
    }
}

function verificarResultado() {
    let vencedor = null;
    let combinacao = null;
    for (const combo of combinacoesVencedoras) {
        if (combo.every(index => tabuleiro[index] === jogadorAtual)) {
            vencedor = jogadorAtual;
            combinacao = combo;
            break;
        }
    }
    const empate = !vencedor && tabuleiro.every(cell => cell !== '');
    return { vencedor, combinacao, empate };
}

function destacarVitoria(combinacao) {
    combinacao.forEach(index => {
        cells[index].classList.add('winner');
    });
}

function atualizarPlacar() {
    if (jogadorAtual === 'X') {
        scoreX++;
        scoreXSpan.textContent = scoreX;
    } else {
        scoreO++;
        scoreOSpan.textContent = scoreO;
    }
}

function reiniciarJogo() {
    tabuleiro.fill('');
    jogando = true;
    jogadorAtual = 'X';
    statusDiv.textContent = `Vez do jogador: ${jogadorAtual}`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner');
    });
    if (isPvIA && jogadorAtual === 'O') {
        setTimeout(jogadaIA, 500);
    }
}

function toggleMode() {
    isPvIA = !isPvIA;
    toggleModeBtn.textContent = isPvIA ? 'Mudar para PvP' : 'Mudar para PvIA';
    reiniciarJogo();
}

function jogadaIA() {
    const melhorJogada = minimax(tabuleiro, 'O').index;
    jogar(melhorJogada, 'O');
}

function minimax(novoTabuleiro, jogador) {
    const espacosVazios = novoTabuleiro.reduce((acc, val, idx) => {
        if (val === '') acc.push(idx);
        return acc;
    }, []);

    if (verificarVencedor('O', novoTabuleiro)) return { score: 10 };
    if (verificarVencedor('X', novoTabuleiro)) return { score: -10 };
    if (espacosVazios.length === 0) return { score: 0 };

    const jogadas = [];
    for (const index of espacosVazios) {
        const jogada = {};
        jogada.index = index;
        novoTabuleiro[index] = jogador;
        if (jogador === 'O') {
            jogada.score = minimax(novoTabuleiro, 'X').score;
        } else {
            jogada.score = minimax(novoTabuleiro, 'O').score;
        }
        novoTabuleiro[index] = '';
        jogadas.push(jogada);
    }

    let melhorJogada;
    if (jogador === 'O') {
        let melhorScore = -Infinity;
        for (const jogada of jogadas) {
            if (jogada.score > melhorScore) {
                melhorScore = jogada.score;
                melhorJogada = jogada;
            }
        }
    } else {
        let piorScore = Infinity;
        for (const jogada of jogadas) {
            if (jogada.score < piorScore) {
                piorScore = jogada.score;
                melhorJogada = jogada;
            }
        }
    }
    return melhorJogada;
}

function verificarVencedor(jogador, tabuleiroCheck = tabuleiro) {
    return combinacoesVencedoras.some(combinacao => {
        return combinacao.every(index => tabuleiroCheck[index] === jogador);
    });
}

inicializarJogo();