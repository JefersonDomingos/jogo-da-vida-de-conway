
let grid;
let proximaGeraçao;
let cols;
let rows;
let space;
let executando = true;
let xSelecionado = 10;
let ySelecionado = 10;
const resoluçao = 10;

function geraQuadroVazio(cols, rows) {
    return Array(cols).fill(null).map(() => Array(rows));
}

function gerarGrid(cols, rows, vazio = false) {
    const arr2D = geraQuadroVazio(cols, rows);

    if (vazio === false) {
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                arr2D[col][row] = floor(random(2));
            }
        }
    } else {
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                arr2D[col][row] = 0;
            }
        }
    }


    return arr2D
}

function calculeLaterais(grid, x, y) {

    let vizinhosSoma = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;
            vizinhosSoma += grid[col][row];
        }
    }

    vizinhosSoma -= grid[x][y];

    return vizinhosSoma
}

function desenheGrid() {
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const x = col * resoluçao;
            const y = row * resoluçao;

            (grid[col][row] === 1) ? rect(x, y, resoluçao, resoluçao) : null

        }
    }
}


function gerarGeracao() {
    proximaGeraçao = gerarGrid(cols, rows);

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {

            const celulaAtual = grid[col][row];

            const vizinhos = calculeLaterais(grid, col, row);

            if ((celulaAtual === 1) && (vizinhos < 2)) proximaGeraçao[col][row] = 0;
            else if ((celulaAtual === 1) && (vizinhos > 3)) proximaGeraçao[col][row] = 0;
            else if ((celulaAtual === 0) && (vizinhos === 3)) proximaGeraçao[col][row] = 1;
            else proximaGeraçao[col][row] = celulaAtual;

        }
    }

    grid = proximaGeraçao;
}

function setup() {
    createCanvas(480, 480);

    cols = width / resoluçao;
    rows = height / resoluçao;
    grid = gerarGrid(cols, rows);

    space = min(width, height) / max(rows, cols);

}

function draw() {

    background(0);
    frameRate(10);
    if (executando === true) {
        gerarGeracao();
    }

    document.getElementById('limpar-tabuleiro').addEventListener('click', () => {
        grid = gerarGrid(cols, rows, vazio = true);
        executando = false;
    })

    document.getElementById('executar-jogo').addEventListener('click', () => {
        executando = true;
    })

    document.getElementById('gerar-tabuleiro').addEventListener('click', () => {
        grid = gerarGrid(cols, rows);
    })

    desenheGrid();
}

function mousePressed() {

    xSelecionado = floor(mouseX / space);
    ySelecionado = floor(mouseY / space);
    if (xSelecionado < cols && ySelecionado < rows) {
        (grid[xSelecionado][ySelecionado] == 0) ? grid[xSelecionado][ySelecionado] = 1 : grid[xSelecionado][ySelecionado] = 0
    }
}


let botaoRegras = document.getElementById("regras-jogo");

botaoRegras.addEventListener('click',function(){
    botaoRegras.classList.toggle("clicado")
    let listaRegras = document.getElementById("lista-regras");
    listaRegras.classList.toggle("mostrar-regras")

    listaRegras.innerHTML=`<h2>As regras do jogo são: </h2><br>
    <p>- Qualquer espaço vazio com exatamente três vizinhos vivos se torna uma célula viva.</p>
    <p>- Qualquer célula viva com menos de dois vizinhos vivos morre de solidão. </p>
    <p>- Qualquer célula viva com mais de três vizinhos vivos morre de superpopulação.</p>
    <p>- Qualquer célula viva com dois ou três vizinhos vivos continua viva para a próxima
    geração.</p>
    <p></p>`

})