/* ==================================================
    EP01 - Exercício programa de MAC0420/MAC5744

    Nome: Renan Ryu Kajihara
    NUSP: 14605762

    Ao preencher esse cabeçalho com o meu nome e o meu número USP,
    declaro que todas as partes originais desse exercício programa (EP)
    foram desenvolvidas e implementadas por mim e que portanto não 
    constituem desonestidade acadêmica ou plágio.
    Declaro também que sou responsável por todas as cópias desse
    programa e que não distribui ou facilitei a sua distribuição.
    Estou ciente que os casos de plágio e desonestidade acadêmica
    serão tratados segundo os critérios divulgados na página da 
    disciplina.
    Entendo que EPs sem assinatura devem receber nota zero e, ainda
    assim, poderão ser punidos por desonestidade acadêmica.

    Abaixo descreva qualquer ajuda que você recebeu para fazer este
    EP.  Inclua qualquer ajuda recebida por pessoas (inclusive
    monitores e colegas). Com exceção de material da disciplina, caso
    você tenha utilizado alguma informação, trecho de código,...
    indique esse fato abaixo para que o seu programa não seja
    considerado plágio ou irregular.

    Exemplo:

        A minha função quicksort() foi baseada na descrição encontrada na 
        página https://www.ime.usp.br/~pf/algoritmos/aulas/quick.html.

    Descrição de ajuda ou indicação de fonte:



================================================== */

// ALGUMAS CONSTANTES USADAS NO EP01 DEMO
const BG_COLOR = 'black';
const BG_FONT  = '14px Arial';
const COR_CINZA = '#d0d0d0';
const COR_CERTA = '#00FF00';
const COR_ERRADA = '#FF0000';

const MAX_NUM = 99; // usado nas equações
const MIN_NUM = 10;

// ==================================================================
window.onload = main;

var gCanvas;
var gCtx;
var gInterface={};
var gWidth, gHeight;
var gBotao_clickado =false;
var gValor_botao = 0;
var linhas;
var colunas;
var matrix = [];
var matrix_acertou = [];
var matrix_contas = [];
var matrix_retangulo_ocupado=[];
var numero_quadrados=1000;
var contador=0;
var numero_acertos = 0;
var bt;
var buttonDown = false;
var pos_x;
var pos_y;
var parou = false;
var posInicialX;
var posInicialY;

var original_i;
var original_j;
var original_acertou;
// Declare outras variáveis globais que desejar
// recomendamos o padrão camel case e um código para identificar 
// variáveis globais e seus tipos.

// ------------------------------------------------------------------
/**
 * função main
 */
function main() {
    gCanvas = document.getElementById("gridCanvas");
    gCtx = gCanvas.getContext("2d");
    gWidth = gCanvas.width;
    gHeight = gCanvas.height;

    // resto do seu código

    gInterface.n_linhas = document.getElementById('nRows');
    gInterface.n_colunas = document.getElementById('nCols');
    gInterface.regenerate = document.getElementById('bRegenerate');
    gInterface.check = document.getElementById('bCheck');
    gInterface.texto_final = document.getElementById("texto_final");
    gInterface.new_buttons=document.getElementById("new_buttons");
    gInterface.regenerate.onclick = callbackregen;
    gInterface.check.onclick = callbackFinalButton;
    document.onmousedown = callbackOnMouseDown;
    document.onmouseup = callbackMouseUp;
    
    gCanvas.onmousemove = callbackOnMouseMove;
}

// ------------------------------------------------------------------

function callbackregen(e){
    
    linhas = parseInt(gInterface.n_linhas.value);
    colunas = parseInt(gInterface.n_colunas.value);
    console.log("linhas" , linhas, "colunas:", colunas);
    numero_quadrados=linhas*colunas;
    contador = 0;
    numero_acertos=0;
    gInterface.texto_final.innerText = ``;
    limparTela();
    apaga_botoes();
    let quad = new Path2D();
    for (let i = 1; i<colunas;i++){
        quad.moveTo(i*(gHeight/colunas), 0);
        quad.lineTo(i*(gHeight/colunas), gWidth);
    }
    for (let i = 1; i<linhas;i++){
        quad.moveTo(0, i*(gWidth/linhas));
        quad.lineTo( gHeight, i*(gWidth/linhas));
    }

    
    for (let i = 0; i < linhas; i++) {
      matrix[i] = new Array(colunas).fill(0);  
      matrix_acertou[i] = new Array(colunas).fill(0); 
      matrix_contas[i] = new Array(colunas).fill(0); 
      matrix_retangulo_ocupado[i] = new Array(colunas).fill(0); 
    }

    for (let i = 1; i<colunas+1;i++){
        for (let j=1;j <linhas+1;j++){
            let num_1 = sortear();
            let num_2 = sortear();
            matrix[j-1][i-1] = num_1+num_2;
            let msg = num_1 + "+" + num_2;
            matrix_contas[j-1][i-1] = msg;
            desenheTexto(msg, ((i*(gWidth/colunas) +(i-1)*(gWidth/colunas))/2) , (j*(gHeight/linhas) + (j-1)*(gHeight/linhas))/2);
        }
    }
    gCtx.strokeStyle = 'blue';
    gCtx.lineWidth = 1;
    gCtx.stroke(quad);

    cria_botoes(linhas,colunas, matrix);
}

function callbackOnMouseDown(e){
    console.log("down");
    buttonDown=true;
}

function callbackMouseUp(e){
    buttonDown=false;
    if (parou){
        levantou();
        parou = false;
    }
}
function callbackOnMouseMove(e){
    console.log("movendo");
    if (gBotao_clickado && buttonDown){
        bt.style.position='absolute';
        bt.style.left = `${e.clientX -25}px`; 
        bt.style.top = `${e.clientY-25}px`;
        pos_x = e.offsetX;
        pos_y = e.offsetY;
        parou = true;
    }
}

function levantou(){
    console.log("levantou!");
    if (gBotao_clickado){
        gBotao_clickado=false;
        let x = pos_x;
        let y = pos_y;
        //desenheTexto(`${gValor_botao}`,x,y);
        let posicaoy= Math.floor(x / (gWidth/colunas));
        let posicaox = Math.floor(y / (gHeight/linhas));
        console.log("posicaox ",posicaox, "posicaoy", posicaoy);
        

        if (matrix_retangulo_ocupado[posicaox][posicaoy]==0){
            matrix_retangulo_ocupado[posicaox][posicaoy] =1;

            let pos_ofi_y=(((posicaox+1)*(gWidth/linhas) +(posicaox)*(gWidth/linhas))/2);
            let pos_ofi_x = ((posicaoy+1)*(gHeight/colunas) + (posicaoy)*(gHeight/colunas))/2;    

            let canvasRect = gCanvas.getBoundingClientRect();

            let canvasOffsetX = canvasRect.left; 
            let canvasOffsetY = canvasRect.top;

            bt.style.position = 'absolute';
            bt.style.left = `${pos_ofi_x + canvasOffsetX - 25}px`; 
            bt.style.top = `${pos_ofi_y + canvasOffsetY +2}px`;

            bt.value = 10*posicaox + posicaoy;
            console.log(`posição x: ${pos_ofi_x + canvasOffsetX - 25}, posição y: ${pos_ofi_y + canvasOffsetY +2}`)
            if (matrix[posicaox][posicaoy] == gValor_botao){
                matrix_acertou[posicaox][posicaoy]=1;
                numero_acertos++;
            }
            if (bt.clicked==false){
                contador++;
                bt.clicked=true;
            }
        
            console.log("contador: ", contador , "n_quad: ", numero_quadrados);
            if (contador == numero_quadrados){
                gInterface.check.disabled = false;
            }
        }
        else{
            bt.style.left = `${posInicialX}px`;  
            bt.style.top = `${posInicialY}px`;

            if (bt.clicked){
            matrix_retangulo_ocupado[original_i][original_j]=1;
            if (original_acertou==1){
                matrix_acertou[original_i][original_j]=1;
                numero_acertos++;}

        }
        }
    }
}

function callbackFinalButton(e){
    limparTela();
    let quad = new Path2D();

    for (let i = 0; i<linhas;i++){
        for (let j=0;j <colunas;j++){
            if (matrix_acertou[i][j] == 1){
                desenhaRetangulo(j*(gWidth/colunas),i*(gHeight/linhas) ,gWidth/colunas, gHeight/linhas, COR_CERTA);
            }
            else{
                desenhaRetangulo(j*(gWidth/colunas),i*(gHeight/linhas) ,gWidth/colunas, gHeight/linhas, COR_ERRADA);
            }
        }
    }

    for (let i = 1; i<colunas;i++){
        quad.moveTo(i*(gHeight/colunas), 0);
        quad.lineTo(i*(gHeight/colunas), gWidth);
    }
    for (let i = 1; i<linhas;i++){
        quad.moveTo(0, i*(gWidth/linhas));
        quad.lineTo( gHeight, i*(gWidth/linhas));
    }
    gCtx.strokeStyle = 'blue';
    gCtx.lineWidth = 1;
    gCtx.stroke(quad);
    for (let i = 1; i<colunas+1;i++){
        for (let j=1;j <linhas+1;j++){
            let msg = `${matrix_contas[j-1][i-1]}`
            desenheTexto(msg, ((i*(gWidth/colunas) +(i-1)*(gWidth/colunas))/2) , (j*(gHeight/linhas) + (j-1)*(gHeight/linhas))/2);
        }
    }
    gInterface.texto_final.innerText = `Você fez ${numero_acertos} pontos!`;
    
    gInterface.check.disabled = true;
}

function cria_botoes(l, c, matrix){
    let div_botoes= document.getElementById("numberPool");
    for (let i=0;i<l;i++){
        for (let j = 0; j<c;j++){
            console.log("botão");
            let botao = document.createElement('button');
            let num = matrix[i][j];
            botao.innerHTML = `${num}`;
            botao.id = `botao_${i}_${j}`;
            botao.style.backgroundColor = 'yellow';  
            botao.style.color = 'black';  
            botao.style.width = '50px';  
            botao.style.height = '50px';
            botao.style.borderRadius = '100%';  
            botao.clicked = false;
            botao.value = 100; 
            botao.onmousedown = callbackbotao;
            // botao.onmousemove = callbackbotaomove
    
            div_botoes.appendChild(botao);
        }
    }
}

function callbackbotao(e){
    bt = e.target;
    console.log("botao clickado");
    gBotao_clickado=true;
    gValor_botao = parseInt(e.target.innerHTML);
    console.log(gValor_botao);

    const pos = bt.getBoundingClientRect();
    posInicialX = pos.left + window.scrollX; 
    posInicialY = pos.top + window.scrollY;

    if (bt.clicked){
        console.log("já foi clickado");
   
        let i = Math.floor(bt.value /10);
        let j = bt.value%10;
        console.log(`${i}   ${j}`);
        original_i=i;
        original_j=j;
        original_acertou=0;
        matrix_retangulo_ocupado[i][j]=0;
        if (matrix_acertou[i][j]==1){
            original_acertou = 1;
            matrix_acertou[i][j]=0;
            numero_acertos--;
        }
    }
}


function limparTela() {
    gCtx.clearRect(0, 0, gWidth, gHeight);
}



function desenheTexto(msg, x, y, tam = 20, cor = 'black') {
    gCtx.fillStyle = cor;
    gCtx.font = `${tam}px serif`;
    gCtx.fillText(msg, x-tam, y);
  }


function sortear() {
    return Math.floor(Math.random() * 90) + 10;
}

function apaga_botoes(){  
    let div_botoes = document.getElementById('numberPool');
    div_botoes.innerHTML = '';
}
    
function desenhaRetangulo (x, y, base,altura, cor){
    let quad = new Path2D();
    quad.moveTo(x, y);
    quad.lineTo(x + base, y);
    quad.lineTo(x + base, y + altura);
    quad.lineTo(x, y + altura);
    quad.closePath();
    gCtx.fillStyle = cor;
    gCtx.fill(quad);
}   
