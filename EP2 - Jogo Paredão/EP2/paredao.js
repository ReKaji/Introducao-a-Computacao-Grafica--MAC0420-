/* 

EP2 de MAC0420/MAC5744 - Paredão

Autor: Renan Ryu Kajihara
Data: 01/05/2025
Comentários: essa solução foi baseada nos capítulos 7 e 8 do material do curso
*/


"use strict";

// ==================================================================
// constantes globais

const FUNDO = [0.0, 0.25, 0.0, 1.0];


// ==================================================================
// variáveis globais
var gl;
var gCanvas;
var gShader = {};  
var gInterface={};
var gVertexShaderSrc;
var gFragmentShaderSrc;

// variáveis globais para os objetos
var gPosicoes = [];
var gCores = [];
var gObjetos = [];

// variável de controle do tempo
var delta=0;

//variáveis que controlam o jogo
var jogar = false;
var passo = null;
var parado = false;
var perdeu = false;

// cores
const BLUE    = [0.0, 0.0, 1.0, 1.0];
const YELLOW  = [1.0, 1.0, 0.0, 1.0];
const MAGENTA = [1.0, 0.0, 1.0, 1.0];

// variáveis do canvas (altura e largura)
var cx;
var cy;

//variáveis da raquete
var RAQ_H;
var   RAQ_MIN_W;
var RAQ_ALT;
var RAQ_ESQ;
var   RAQ_VEL;

// variáveis da bola
var BOLA_LADO_X;
var BOLA_LADO_Y;
var BOLA_ESQ;
var BOLA_ALT;
var BOLA_MIN_VEL_X;
var BOLA_MIN_VEL_Y;


// grid de tijolos
var NLINS;
var NCOLS;
var BORDA;  
var ALTURA_PAREDE; 



// ==================================================================
// chama a main quando terminar de carregar a janela
window.onload = main;

/**
 * programa principal.
 */
function main() {
  gCanvas = document.getElementById("glcanvas");
  gl = gCanvas.getContext('webgl2');
  if (!gl) alert("WebGL 2.0 isn't available");

  

    cx = gCanvas.width;
    cy= gCanvas.height;


    RAQ_H     = 0.01 * cy ;
    RAQ_MIN_W = 0.05 * cx;
    RAQ_ALT = 0.10 * cy;
    RAQ_ESQ = (0.5- (RAQ_MIN_W/cx)/2) * cx;
    RAQ_VEL = 0.5 * cx;

    BOLA_LADO_X  = 0.02 * cx;
    BOLA_LADO_Y  = 0.02 * cy;
    BOLA_ESQ = ((0.5 - ((BOLA_LADO_X/cx)/2))*cx)-8;
    BOLA_ALT = (0.01+0.1)*cy + 3;
    BOLA_MIN_VEL_X = 0.05 * cx;
    BOLA_MIN_VEL_Y = 0.05 * cy;

   
    NLINS = 5;
    NCOLS = 10;
    BORDA = 0.003 * cx;  
    ALTURA_PAREDE =0.975 * cy; 

    // cria a interface
    cria_interface();

    //inicializa os objetos
    gObjetos.push(new Bloco(RAQ_ESQ,RAQ_ALT, RAQ_MIN_W, RAQ_H, 0, 0,BLUE));
    gObjetos.push(new Bola(BOLA_ESQ,BOLA_ALT, BOLA_LADO_X, BOLA_LADO_Y, BOLA_MIN_VEL_X, BOLA_MIN_VEL_Y,YELLOW));
    
    for (let j = 0; j<3; j++){
      for (let i = 0; i < NCOLS; i++) {
        let x = 0.1*cx - BORDA;
        gObjetos.push(new Bloco(32 + (i*(x+BORDA)), ALTURA_PAREDE, x, 0.05*cy, 0 ,0 , MAGENTA));
      }
      ALTURA_PAREDE -= 0.1*cy + 2*BORDA;
    }

    ALTURA_PAREDE = (0.975 * cy)  - (0.05*cy + BORDA);; // relativo a altura da quadra
    for (let j = 0; j<2; j++){
      for (let i = 0; i < 9; i++) {
        let x = 0.1*cx - BORDA;
        gObjetos.push(new Bloco(48 + (i*(x+BORDA)), ALTURA_PAREDE, x, 0.05*cy, 0 ,0 , MAGENTA));
      }
      ALTURA_PAREDE -= 0.1*cy + 2*BORDA;
    }
    
    //cria os shaders
  crieShaders();

  
  gl.clearColor(FUNDO[0], FUNDO[1], FUNDO[2], FUNDO[3]);

 //desenha
  desenhe();
    
}

//cria a interface
function cria_interface(){
    gInterface.vel_bola = document.getElementById("vel_bola");
    gInterface.vel_bola.onchange = callbackbola;

    gInterface.tam_raq = document.getElementById("tam_raquete");
    gInterface.tam_raq.onchange = callbackraquete;
    
    
    gInterface.jogar = document.getElementById("jogar");
    gInterface.jogar.onclick =  callbackjogar;
    
    gInterface.limpar = document.getElementById("limpar");
    gInterface.limpar.onclick = callbacklimpar;

    window.onkeydown = function(e) {
        const key = e.key;
        console.log("clicou na tecla", key);
        if (key === 'p' && !jogar) {
            passo = 0.015;
        }
        switch(key){
            case 'a':
                gObjetos[0].vel = vec2(-RAQ_VEL, 0); 
                break;
            case 'd':
                gObjetos[0].vel = vec2(RAQ_VEL, 0); 
                break;
            case 's':
                gObjetos[0].vel = vec2(0, 0); 
                break;
        }
    }
}

//função que controla a velocidade da bola
function callbackbola(e) {   
  let valor = parseInt(e.target.value);
  console.log("bola aumentou a velocidade para: ", valor);

  let sinalVx = Math.sign(gObjetos[1].vx);
  let sinalVy = Math.sign(gObjetos[1].vy);

  gObjetos[1].vx = sinalVx * BOLA_MIN_VEL_X * valor;
  gObjetos[1].vy = sinalVy * BOLA_MIN_VEL_Y * valor;
  gObjetos[1].vel = vec2(gObjetos[1].vx, gObjetos[1].vy);
}

//função que limpa o jogo
function callbacklimpar(e){
    console.log("limpar");
    gPosicoes = [];
    gCores = [];
    gObjetos = [];
    gObjetos.push(new Bloco(RAQ_ESQ,RAQ_ALT, RAQ_MIN_W * parseInt(gInterface.tam_raq.value), RAQ_H, 0, 0,BLUE));
    gObjetos.push(new Bola(BOLA_ESQ,BOLA_ALT, BOLA_LADO_X, BOLA_LADO_Y, BOLA_MIN_VEL_X *parseInt(gInterface.vel_bola.value), BOLA_MIN_VEL_Y * parseInt(gInterface.vel_bola.value),YELLOW));
    ALTURA_PAREDE =0.975 * cy;
    for (let j = 0; j<3; j++){
      for (let i = 0; i < NCOLS; i++) {
        let x = 0.1*cx - BORDA;
        gObjetos.push(new Bloco(32 + (i*(x+BORDA)), ALTURA_PAREDE, x, 0.05*cy, 0 ,0 , MAGENTA));
      }
      ALTURA_PAREDE -= 0.1*cy + 2*BORDA;
    }

    ALTURA_PAREDE = (0.975 * cy)  - (0.05*cy + BORDA);
    for (let j = 0; j<2; j++){
      for (let i = 0; i < 9; i++) {
        let x = 0.1*cx - BORDA;
        gObjetos.push(new Bloco(48 + (i*(x+BORDA)), ALTURA_PAREDE, x, 0.05*cy, 0 ,0 , MAGENTA));
      }
      ALTURA_PAREDE -= 0.1*cy + 2*BORDA;
    }
    perdeu = false;
    jogar = false;
    parado = false;;
    gInterface.jogar.innerHTML = "Jogar";
}

//função que controla o botão de jogar
function callbackjogar(e){
    const botao = e.target; 
    if (!jogar) {
      if (!perdeu){
          console.log("jogar");
          botao.innerHTML = "Parar";
          jogar = true;
          parado = false;
      }
    } else {
      if (!perdeu){
        console.log("parar");
        botao.innerHTML = "Jogar";
        jogar = false;
        parado = true;
      }
    }
}

//função que controla o tamanho da raquete
function callbackraquete(e){
    let valor = parseFloat(e.target.value);
    console.log("raquete mudou de tamanho para: ", valor);
    gObjetos[0].l = RAQ_MIN_W * valor; 
}

/**
 * define os vértices de um retângulo centrado na origem
 * @param {Number} l - largura do retângulo
 * @param {Number} r - altura do retângulo
 * @returns {Array} - lista de vértices do retângulo
 */
function aproximeRetangulo(l, r) {
    
    return [
        vec2(-l / 2, -r / 2), 
        vec2(l / 2, -r / 2),  
        vec2(l / 2, r / 2),   
        vec2(-l / 2, r / 2)   
    ];
}

/**
 * define a classe de objetos do tipo Bloco (raquete e tijolos)
 * @param {Number} x - centro x
 * @param {Number} y - centro y
 * @param {Number} l - largura
 * @param {Number} r - altura
 * @param {Number} vx - velocidade no eixo x
 * @param {Number} vy - velocidade no eixo y
 * @param {Array} cor - cor RGBA
 */
function Bloco(x,y,l,r,vx,vy,cor){ 
    this.l = l;
    this.r = r;
  this.vertices = aproximeRetangulo(this.l,this.r);
  this.nv = this.vertices.length;
  this.vx =vx;
  this.vy = vy;
  this.vel = vec2(vx, vy);
  this.cor = cor;
  this.pos = vec2(x, y);
 
  let centro = this.pos;
  let nv = this.nv;
  let vert = this.vertices;
  for (let i = 0; i < nv; i++) {
    let k = (i + 1) % nv;
    gPosicoes.push(centro);
    gPosicoes.push(add(centro, vert[i])); 
    gPosicoes.push(add(centro, vert[k]));

    gCores.push(cor);
    gCores.push(cor);
    gCores.push(cor);
  }
  /**
   * atualiza a posicao dos blocos (no caso da raquete, a posição é atualizada)
   * @param {*} delta - intervalo de tempo desde a ultima atualizacao
   */
  this.atualize = function (delta) {
    this.vertices = aproximeRetangulo(this.l, this.r);
    this.pos = add(this.pos, mult(delta, this.vel));
    let x, y;
    [x, y] = this.pos;

    
    if (x - this.l / 2 < 0) {
        x = this.l / 2; 
        this.vel = vec2(0, 0);
    }
    if (x + this.l / 2 > gCanvas.width) {
        x = gCanvas.width - this.l / 2; 
        this.vel = vec2(0, 0); 
    }

    this.pos = vec2(x, y);

    let centro = this.pos;
    let nv = this.nv;
    let vert = this.vertices;
    for (let i = 0; i < nv; i++) {
        let k = (i + 1) % nv;
        gPosicoes.push(centro);
        gPosicoes.push(add(centro, vert[i]));
        gPosicoes.push(add(centro, vert[k]));
    }
  }
};

/**
 * define a classe de objetos do tipo Bola (a bola do jogo)
 * @param {Number} x - centro x
 * @param {Number} y - centro y
 * @param {Number} l - largura (lado horizontal do quadrado)
 * @param {Number} r - altura (lado vertical do quadrado)
 * @param {Number} vx - velocidade no eixo x
 * @param {Number} vy - velocidade no eixo y
 * @param {Array} cor - cor RGBA
 */
function Bola(x,y,l,r,vx,vy,cor){ 
  this.l = l;
  this.r = r;
this.vertices = aproximeRetangulo(this.l,this.r);
this.nv = this.vertices.length;
this.vx =vx;
  this.vy = vy;
this.vel = vec2(this.vx, this.vy);
this.cor = cor;
this.pos = vec2(x, y);
  
let centro = this.pos;
let nv = this.nv;
let vert = this.vertices;
for (let i = 0; i < nv; i++) {
  let k = (i + 1) % nv;
  gPosicoes.push(centro);
  gPosicoes.push(add(centro, vert[i])); 
  gPosicoes.push(add(centro, vert[k]));

  gCores.push(cor);
  gCores.push(cor);
  gCores.push(cor);
}
/**
 * atualiza a posicao dos vertices da bola observando se houve colisao com objetos ou com a borda do canvas
 * @param {*} delta - intervalo de tempo desde a ultima atualizacao
 */
this.atualize = function (delta) {
  
  this.vertices = aproximeRetangulo(this.l,this.r);
  this.pos = add(this.pos, mult(delta, this.vel));
  let x, y;
  [x, y] = this.pos;
  
  //verifica se a bola passou a raquete
  if (y <= 0.08 * cy) {
    jogar = false;
    parado = false;
    perdeu = true;
    console.log("perdeu");
  }

  // verifica se a bola saiu do canvas
  if (x < 0) { x = -x; this.vx = -this.vx; }
  if (y < 0) { y = -y; this.vy = -this.vy; }
  if (x + this.l > gCanvas.width) { x = gCanvas.width - this.l; this.vx = -this.vx; }
  if (y + this.r > gCanvas.height) { y = gCanvas.height - this.r; this.vy = -this.vy; }

  // Verifica colisão com a raquete
  let raquete = gObjetos[0]; 
  if (
      x + this.l / 2 > raquete.pos[0] - raquete.l / 2 && 
      x - this.l / 2 < raquete.pos[0] + raquete.l / 2 && 
      y - this.r / 2 < raquete.pos[1] + raquete.r / 2 && 
      y + this.r / 2 > raquete.pos[1] - raquete.r / 2    
  ) {
      this.vy = -this.vy; // Inverte a direção vertical da bola
      
  }

  // Verifica colisão com os tijolos
  // Começa a verificar a partir do índice 2, pois os dois primeiros objetos são a raquete e a bola
  for (let i = 2; i < gObjetos.length; i++) { 
    let tijolo = gObjetos[i];
    if (
        x + this.l / 2 > tijolo.pos[0] - tijolo.l / 2 && 
        x - this.l / 2 < tijolo.pos[0] + tijolo.l / 2 && 
        y + this.r / 2 > tijolo.pos[1] - tijolo.r / 2 &&
        y - this.r / 2 < tijolo.pos[1] + tijolo.r / 2   
    ) {
      let dist_horizontal = Math.min(x + this.l / 2 - tijolo.pos[0] + tijolo.l / 2, tijolo.pos[0] + tijolo.l / 2 - (x - this.l / 2));
      let dist_vertical = Math.min( y + this.r / 2 - tijolo.pos[1] + tijolo.r / 2, tijolo.pos[1] + tijolo.r / 2 - (y - this.r / 2));
        // verifica se a colisão foi horizontal ou vertical
        if (dist_horizontal < dist_vertical) {
            this.vx = -this.vx; // Reflete horizontalmente
            console.log("colisão horizontal");
        } else {
            this.vy = -this.vy; // Reflete verticalmente
            console.log("colisão vertical");
        }

        // Remove o tijolo atingido
        gObjetos.splice(i, 1);
        break;
    }
}
  let centro = this.pos = vec2(x, y);
  this.vel = vec2(this.vx, this.vy);

  let nv = this.nv;
  let vert = this.vertices;
  for (let i = 0; i < nv; i++) {
    let k = (i + 1) % nv;
    gPosicoes.push(centro);
    gPosicoes.push(add(centro, vert[i]));
    gPosicoes.push(add(centro, vert[k]));
  }
}
};





/**
 * cria e configura os shaders
 */
function crieShaders() {
    //  cria o programa
    gShader.program = makeProgram(gl, gVertexShaderSrc, gFragmentShaderSrc);
    gl.useProgram(gShader.program);
  
    // carrega dados na GPU
    gShader.bufPosicoes = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gShader.bufPosicoes);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(gPosicoes), gl.STATIC_DRAW);
  
    // Associa as variáveis do shader ao buffer gPosicoes
    var aPositionLoc = gl.getAttribLocation(gShader.program, "aPosition");
    // Configuração do atributo para ler do buffer
    // atual ARRAY_BUFFER
    let size = 2;          // 2 elementos de cada vez - vec2
    let type = gl.FLOAT;   // tipo de 1 elemento = float 32 bits
    let normalize = false; // não normalize os dados
    let stride = 0;        // passo, quanto avançar a cada iteração depois de size*sizeof(type) 
    let offset = 0;        // começo do buffer
    gl.vertexAttribPointer(aPositionLoc, size, type, normalize, stride, offset);
    gl.enableVertexAttribArray(aPositionLoc);
  
    // buffer de cores
    var bufCores = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufCores);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(gCores), gl.STATIC_DRAW);
    var aColorLoc = gl.getAttribLocation(gShader.program, "aColor");
    gl.vertexAttribPointer(aColorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColorLoc);
  
    // resolve os uniforms
    gShader.uResolution = gl.getUniformLocation(gShader.program, "uResolution");
  
  };
  
  /**
   * Usa o shader para desenhar.
   * Assume que os dados já foram carregados e são estáticos.
   */
  function desenhe() {
    if(jogar){
      
        delta = 0.015;
        
    }
    else if (passo != null && parado){
        delta = passo;
        passo = null;
    }
    else{
        delta = 0;
    }
    // desenha vertices
    gPosicoes = [];
    for (let i = 0; i < gObjetos.length; i++)
      gObjetos[i].atualize(delta);
  
    // atualiza o buffer de vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, gShader.bufPosicoes);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(gPosicoes), gl.STATIC_DRAW);
  
    gl.uniform2f(gShader.uResolution, gCanvas.width, gCanvas.height);
  
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, gPosicoes.length);
  
    window.requestAnimationFrame(desenhe);
  }
  
  // ========================================================
  // Código fonte dos shaders em GLSL
  // a primeira linha deve conter "#version 300 es"
  // para WebGL 2.0
  
  gVertexShaderSrc = `#version 300 es
  
  // aPosition é um buffer de entrada
  in vec2 aPosition;
  uniform vec2 uResolution;
  in vec4 aColor;  // buffer com a cor de cada vértice
  out vec4 vColor; // varying -> passado ao fShader
  
  void main() {
      vec2 escala1 = aPosition / uResolution;
      vec2 escala2 = escala1 * 2.0;
      vec2 clipSpace = escala2 - 1.0;
  
      gl_Position = vec4(clipSpace, 0, 1);
      vColor = aColor; 
  }
  `;
  
  gFragmentShaderSrc = `#version 300 es
  
  // Vc deve definir a precisão do FS.
  // Use highp ("high precision") para desktops e mediump para mobiles.
  precision highp float;
  
  // out define a saída 
  in vec4 vColor;
  out vec4 outColor;
  
  void main() {
    outColor = vColor;
  }
  `;