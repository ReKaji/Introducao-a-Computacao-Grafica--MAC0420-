/* 

Projeto Final de MAC0420/MAC5744 

Autor: Renan Ryu Kajihara
Data: 24/06/2025
Comentários: essa solução foi baseada nos capítulos 15 a 22 do material do curso
*/

"use strict";


const eye = vec3(2, 2, 0);
const at = vec3(0, 0, 0);
const up = vec3(0, 1, 0);


function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

var perdeu = false; 
var DEBUG = false;
var alturaBracoGlobal;
var posBonecoGlobal;

const BOLHA_NUMERO = 0; 
const BOLHA_PHONG_ALFA_MIN = 50;
const BOLHA_PHONG_ALFA_MAX = 500;
const BOLHA_MIN_VEL = 1;  
const BOLHA_MAX_VEL = 5;
const BOLHA_MIN_POS = -100; 
const BOLHA_MAX_POS =  100;
const BOLHA_MIN_RAIO = 10;
const BOLHA_MAX_RAIO = 30;
const BOLHA_MIN_RESOLUCAO = 0;  
const BOLHA_MAX_RESOLUCAO = 4;  

const alturaPerna = 4 * 3;
  const alturaTorso = 5 * 3;
  const alturaCabeca = 2 * 3;
  const larguraTorso = 2.5 * 3;
  const larguraPerna = 1.2 * 3;
  const larguraBraco = 1 * 3;
  const alturaBraco = 3.5 * 3;
  const profundidade = 1.2 * 3;
  
  

const COR_CLEAR = [0.2, 0.2, 0.6, 1.0];


const URL_CAMISA = "palmeiras.jpg"
const URL_ALVO = "textura_alvo.jpg"; 
const URL_CHAO = "quadra.png";
const URL_RAQUETE = "t2.png"; 
const LUZ = {
    
    pos : vec4(0, 800, 10, 1.0), 
    amb : vec4(0.47, 0.47, 0.47, 1.0), 
    dif : vec4(0.68, 0.68, 0.68, 1.0), 
    esp : vec4(0.39, 0.39, 0.39, 1.0), 
};

const MAT = {
  amb: vec4(0.8, 0.8, 0.8, 1.0),
  dif: vec4(1.0, 0.0, 1.0, 1.0),
  alfa: 50.0,    
};

const AGULHA_INIT = {
    pos : vec3(-20, 40, 250),
    at     : vec3(0, 0, 0),
    up     : vec3(0, 1, 0),
    fovy   : 45.0,
    aspect : 1.0,
    near   : 1,
    far    : 2000,    
    theta : vec3(0, 0, 0),
    vTrans : 0,
    vTheta : vec3(0, 0, 0),
    escala : vec3(5, 5, 5),
    cor : vec4(1.0, 0.0, 0.0, 1.0),
    alfa : 250.0,
};

var gInterface={};

const FOVY = 60;
const ASPECT = 1;
const NEAR = 0.1;
const FAR = 50;


const FUNDO = [0.2, 0.2, 0.6, 1.0];
const EIXO_X_IND = 0;
const EIXO_Y_IND = 1;
const EIXO_Z_IND = 2;
const EIXO_X = vec3(1, 0, 0);
const EIXO_Y = vec3(0, 1, 0);
const EIXO_Z = vec3(0, 0, 1);

const ALTURA_TIJOLOS = 20;
const LARGURA_TIJOLOS = 60;
const LADO_TIJOLO = 6.0; 
const DIST_X = 0.2; 
const DIST_Y = 0.2; 

const paredeMinX = -((LARGURA_TIJOLOS-1)/2) * (LADO_TIJOLO + DIST_X);
const paredeMaxX = ((LARGURA_TIJOLOS-1)/2) * (LADO_TIJOLO + DIST_X);
const paredeMinY = -((ALTURA_TIJOLOS-1)/2) * (LADO_TIJOLO + DIST_Y);
const paredeMaxY = ((ALTURA_TIJOLOS-1)/2) * (LADO_TIJOLO + DIST_Y);

var gl;       
var gCanvas;  

var larguraBracoGlobal;
var larguraTorsoGlobal;

var raquetada = false; 
var raquetadaRetorno = false; 
var anguloBracoD = -30; 

var esfera = []; 
var boneco = [];
var bola = [];

var gShader = {
  aTheta: null,
};

var gCtx = {
  view: mat4(),     
  perspective: mat4(), 
};

var chao = [];
var tijolos = [];

var ultimoTempoRaquetada = 0;
var intervaloRaquetada = 500; 

var alvo = null;
var n_pontos = 0;
window.onload = main;

function main() {
  
  gCanvas = document.getElementById("glcanvas");
  gl = gCanvas.getContext('webgl2');
  if (!gl) alert("Vixe! Não achei WebGL 2.0 aqui :-(");

  console.log("Canvas: ", gCanvas.width, gCanvas.height);

  crieInterface();

  gl.viewport(0, 0, gCanvas.width, gCanvas.height);
  gl.clearColor(FUNDO[0], FUNDO[1], FUNDO[2], FUNDO[3]);
  gl.enable(gl.DEPTH_TEST);


  esfera = [];
    for (let i = 0; i < BOLHA_NUMERO; i++) {
        esfera[i] = new Esfera(randomRange(BOLHA_MIN_RESOLUCAO, BOLHA_MAX_RESOLUCAO));
    }
    esfera[BOLHA_NUMERO] = new Esfera(4); 
    esfera[BOLHA_NUMERO].translatex = 0;
    esfera[BOLHA_NUMERO].translatey = 75;
    esfera[BOLHA_NUMERO].translatez = 428;
    esfera[BOLHA_NUMERO].scalepar = AGULHA_INIT.escala[0];
    esfera[BOLHA_NUMERO].theta = AGULHA_INIT.theta;
    esfera[BOLHA_NUMERO].mat.amb = AGULHA_INIT.cor;
    esfera[BOLHA_NUMERO].mat.dif = AGULHA_INIT.cor;
    esfera[BOLHA_NUMERO].mat.alfa = AGULHA_INIT.alfa;
    //esfera[BOLHA_NUMERO].rodando = true; 
    esfera[BOLHA_NUMERO].vtranslacao = AGULHA_INIT.vTrans;
    esfera[BOLHA_NUMERO].vrotacao = vec3(0,0,0);
    esfera[BOLHA_NUMERO].theta[EIXO_X_IND] = 25;

  // Criação da parede de tijolos

  tijolos = [];
  for (let y = 0; y < ALTURA_TIJOLOS; y++) {
    for (let x = 0; x < LARGURA_TIJOLOS; x++) {
      let cubo = new Cubo();
      cubo.rodando = false;
      cubo.scaleparx = LADO_TIJOLO;
      cubo.scalepary = LADO_TIJOLO;
      cubo.scaleparz = LADO_TIJOLO;
      cubo.translatex = (x - (LARGURA_TIJOLOS-1)/2) * (LADO_TIJOLO + DIST_X);
      cubo.translatey = (y - (ALTURA_TIJOLOS-1)/2) * (LADO_TIJOLO + DIST_Y);
      cubo.translatez = 0;
      cubo.mat = {
        amb: vec4(0.41, 0.41, 0.41, 1.0),
        dif: vec4(0.6, 0.6, 0.6, 1.0),
        alfa: 2.0
      };
      tijolos.push(cubo);
    }
  }
  
  chao = [];
  // Criação do chão
  const MATERIAL_CHAO = {
    amb: vec4(0.3, 0.5, 1.0, 1.0), 
    dif: vec4(0.4, 0.7, 1.0, 1.0), 
    alfa: 10.0 
  };
  let cuboChao = new Cubo();
  cuboChao.rodando = false;
  cuboChao.scaleparx = 600;
  cuboChao.scalepary = 0.5; 
  cuboChao.scaleparz = 600;
  cuboChao.translatex = 0;
  cuboChao.translatey = -(ALTURA_TIJOLOS * (LADO_TIJOLO + DIST_Y))/2 - cuboChao.scalepary/2; 
  cuboChao.translatez = 0;
  cuboChao.mat = MATERIAL_CHAO;
  chao.push(cuboChao);
  
  boneco = [];
  const alturaChao = cuboChao.scalepary; 
  const yChao = cuboChao.translatey + alturaChao / 2;
  const posBoneco = {
    x: 0,
    y: yChao + alturaPerna + alturaTorso/2,
    z: 280
  };
  posBonecoGlobal = posBoneco; 
  alturaBracoGlobal = alturaBraco; 
  larguraTorsoGlobal = larguraTorso; 
  larguraBracoGlobal = larguraBraco; 
  // Cabeça
  let cabeca = new Cubo();
  cabeca.scaleparx = alturaCabeca;
  cabeca.scalepary = alturaCabeca;
  cabeca.scaleparz = alturaCabeca;
  cabeca.translatex = posBoneco.x;
  cabeca.translatey = posBoneco.y + alturaTorso/2 + alturaCabeca/2;
  cabeca.translatez = posBoneco.z;
  cabeca.mat = { amb: vec4(0.7,0.6,0.5,1), dif: vec4(0.9,0.8,0.7,1), alfa: 5 };
  boneco.push(cabeca);
  // Torso
  let torso = new Cubo();
  torso.scaleparx = larguraTorso;
  torso.scalepary = alturaTorso;
  torso.scaleparz = profundidade;
  torso.translatex = posBoneco.x;
  torso.translatey = posBoneco.y;
  torso.translatez = posBoneco.z;
  torso.mat = { amb: vec4(0.0, 0.95, 0.1, 1), dif: vec4(0.0, 0.9, 0.3, 1), alfa: 5 };
  boneco.push(torso);
  // Braço esquerdo
  let bracoE = new Cubo();
  bracoE.scaleparx = alturaBraco * 0.8; 
  bracoE.scalepary = larguraBraco * 0.85; 
  bracoE.scaleparz = profundidade * 0.95; 
  bracoE.translatex = posBoneco.x - (larguraTorso/2 + (alturaBraco*0.8)/2);
  bracoE.translatey = posBoneco.y;
  bracoE.translatez = posBoneco.z;
  bracoE.mat = { amb: vec4(0.7,0.6,0.5,1), dif: vec4(0.9,0.8,0.7,1), alfa: 5 };
  boneco.push(bracoE);
  // Braço direito
  let bracoD = new Cubo();
  bracoD.scaleparx = alturaBraco * 0.8; 
  bracoD.scalepary = larguraBraco * 0.85; 
  bracoD.scaleparz = profundidade * 0.95; 
  bracoD.translatex = posBoneco.x + (larguraTorso/2 + (alturaBraco*0.8)/2);
  bracoD.translatey = posBoneco.y;
  bracoD.translatez = posBoneco.z;
  bracoD.mat = { amb: vec4(0.7,0.6,0.5,1), dif: vec4(0.9,0.8,0.7,1), alfa: 5 };
  boneco.push(bracoD);
  // Perna esquerda
  let pernaE = new Cubo();
  pernaE.scaleparx = larguraPerna;
  pernaE.scalepary = alturaPerna;
  pernaE.scaleparz = profundidade;
  pernaE.translatex = posBoneco.x - larguraPerna/2 - 0.2; 
  pernaE.translatey = yChao + alturaPerna/2;
  pernaE.translatez = posBoneco.z;
  pernaE.mat = { amb: vec4(0.3,0.2,0.1,1), dif: vec4(0.5,0.4,0.3,1), alfa: 5 };
  boneco.push(pernaE);
  // Perna direita
  let pernaD = new Cubo();
  pernaD.scaleparx = larguraPerna;
  pernaD.scalepary = alturaPerna;
  pernaD.scaleparz = profundidade;
  pernaD.translatex = posBoneco.x + larguraPerna/2 + 0.2;
  pernaD.translatey = yChao + alturaPerna/2;
  pernaD.translatez = posBoneco.z;
  pernaD.mat = { amb: vec4(0.3,0.2,0.1,1), dif: vec4(0.5,0.4,0.3,1), alfa: 5 };
  boneco.push(pernaD);
  
  // Raquete de tênis
 
  let caboRaquete = new Cubo();
  caboRaquete.scaleparx =10; 
  caboRaquete.scalepary = 2.5; 
  caboRaquete.translatex = bracoD.translatex + bracoD.scaleparx/2 + caboRaquete.scaleparx/2;
  caboRaquete.translatey = bracoD.translatey;
  caboRaquete.translatez = bracoD.translatez;
  caboRaquete.mat = { amb: vec4(0,0,0,1), dif: vec4(0,0,0,1), alfa: 20 };
  boneco.push(caboRaquete);
  // Cabeça da raquete 
  let cabecaRaquete = new Esfera(3,true); 
  cabecaRaquete.scaleparx = 8;
  cabecaRaquete.scalepary = 8; 
  cabecaRaquete.scaleparz = 2; 
  cabecaRaquete.translatex = caboRaquete.translatex + caboRaquete.scaleparx/2 + cabecaRaquete.scaleparx;
  cabecaRaquete.translatey = caboRaquete.translatey;
  cabecaRaquete.translatez = caboRaquete.translatez;
  cabecaRaquete.mat.amb = vec4(1,1,1,1);
  cabecaRaquete.mat.dif = vec4(1,1,1,1);
  cabecaRaquete.mat.alfa = 30;
  boneco.push(cabecaRaquete);

  // Bola de tênis
  bola = [];
  let bolaTenis = new Esfera(4,true); 
  bolaTenis.scaleparx = 2.5;
  bolaTenis.scalepary = 2.5;
  bolaTenis.scaleparz = 2.5;
  bolaTenis.translatex = posBoneco.x + 10;
  bolaTenis.translatey = posBoneco.y + 10;
  bolaTenis.translatez = posBoneco.z;
  bolaTenis.mat.amb = vec4(0.8, 0.95, 0.2, 1.0); 
  bolaTenis.mat.dif = vec4(0.9, 1.0, 0.3, 1.0);
  bolaTenis.mat.alfa = 10.0; 
  bolaTenis.vrotacao = vec3(0, 0, 15);
  bolaTenis.vrotacao[1] = 0;
  bolaTenis.ay = -0.005;
  bola.push(bolaTenis);

  alvo = null;
  
  alvo = new Esfera(4, true);
  alvo.scaleparx = 40; 
  alvo.scalepary = 40; 
  alvo.scaleparz = 0.7; 
  alvo.translatex = 20;
  alvo.translatey = yChao + alvo.scalepary + 20; 
  alvo.translatez = 6; 
  alvo.mat.amb = vec4(1.0, 1.0, 1.0, 1.0); 
  alvo.mat.dif = vec4(1.0, 1.0, 1.0, 1.0);
  alvo.mat.alfa = 30.0;

  atualizaBracoRaquete(anguloBracoD);

  // shaders
  crieShaders();

  // finalmente...
  render();
  
}

var velBoneco = 5;
function crieInterface() {
  gCanvas.onmousedown = function (ev) {
    if (perdeu) {
      const div = document.getElementById('mensagem-perda');
      if (div) div.style.display = 'none';
      perdeu = false;
      anguloBracoD = -30;
      raquetada = false;
      raquetadaRetorno = false;
      n_pontos = 0;
      atualizarPontuacao();
      main();
      console.log("Reiniciando o jogo...");
    }
  }

  let slider = document.getElementById("slider");
  slider.onchange = function () {
    velBoneco = parseFloat(slider.value);
    console.log("Velocidade do boneco: " + velBoneco);
  }


  window.onkeydown = function (ev) {
    const key = ev.key.toLowerCase();
      //nsole.log(esfera[BOLHA_NUMERO].translatex, esfera[BOLHA_NUMERO].translatey, esfera[BOLHA_NUMERO].translatez);
      //nsole.log("theta: " + esfera[BOLHA_NUMERO].theta[EIXO_X_IND]);
      switch (key) {
        case 'j':
          // Move a câmera e o boneco para a esquerda (eixo X)
          esfera[BOLHA_NUMERO].translatex -= velBoneco;
          for (let i = 0; i < boneco.length; i++) {
            boneco[i].translatex -= velBoneco;
          }
          posBonecoGlobal.x -= velBoneco;
          break;
        case 'l':
          // Move a câmera e o boneco para a direita (eixo X)
          esfera[BOLHA_NUMERO].translatex += velBoneco;
          for (let i = 0; i < boneco.length; i++) {
            boneco[i].translatex += velBoneco;
          }
          posBonecoGlobal.x += velBoneco;
          break;
        
        case ' ': {
          // Espaço: inicia a raquetada
          let agora = Date.now();
          if (!raquetada && !raquetadaRetorno && (agora - ultimoTempoRaquetada > intervaloRaquetada)) {
            raquetada = true;
            anguloBracoD = -30; 
            atualizaBracoRaquete(anguloBracoD);
            ultimoTempoRaquetada = agora;
          }
          break;
        }
      }
    
  }
 
}

// ==================================================================
/**
 * cria e configura os shaders
 */
function crieShaders() {
  //  cria o programa
  gShader.program = makeProgram(gl, gVertexShaderSrc, gFragmentShaderSrc);
  gl.useProgram(gShader.program);

  // buffer das normais
  var bufNormais = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufNormais);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(esfera[0].nor), gl.STATIC_DRAW);

  var aNormal = gl.getAttribLocation(gShader.program, "aNormal");
  gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aNormal);

  // buffer dos vértices
  var bufVertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufVertices);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(esfera[0].pos), gl.STATIC_DRAW);

  var aPosition = gl.getAttribLocation(gShader.program, "aPosition");
  gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition);

  // resolve os uniforms
  gShader.uModel = gl.getUniformLocation(gShader.program, "uModel");
  gShader.uView = gl.getUniformLocation(gShader.program, "uView");
  gShader.uPerspective = gl.getUniformLocation(gShader.program, "uPerspective");
  gShader.uInverseTranspose = gl.getUniformLocation(gShader.program, "uInverseTranspose");

  // calcula a matriz de transformação perpectiva (fovy, aspect, near, far)
  
  gCtx.perspective = perspective(AGULHA_INIT.fovy, AGULHA_INIT.aspect, AGULHA_INIT.near, AGULHA_INIT.far);

  gl.uniformMatrix4fv(gShader.uPerspective, false, flatten(gCtx.perspective));

  //gCtx.view = lookAt(eye, at, up);
  gCtx.view = lookAt(AGULHA_INIT.pos, AGULHA_INIT.at, AGULHA_INIT.up);

  gl.uniformMatrix4fv(gShader.uView, false, flatten(gCtx.view));

  // parametros para iluminação
  gShader.uLuzPos = gl.getUniformLocation(gShader.program, "uLuzPos");
  gl.uniform4fv(gShader.uLuzPos, LUZ.pos);

  // fragment shader
  gShader.uCorAmb = gl.getUniformLocation(gShader.program, "uCorAmbiente");
  gShader.uCorDif = gl.getUniformLocation(gShader.program, "uCorDifusao");
  gShader.uCorEsp = gl.getUniformLocation(gShader.program, "uCorEspecular");
  gShader.uAlfaEsp = gl.getUniformLocation(gShader.program, "uAlfaEsp");

  gl.uniform4fv(gShader.uCorAmb, mult(LUZ.amb, MAT.amb));
  gl.uniform4fv(gShader.uCorDif, mult(LUZ.dif, MAT.dif));
  gl.uniform4fv(gShader.uCorEsp, LUZ.esp);
  gl.uniform1f(gShader.uAlfaEsp, MAT.alfa);

  // var bufTextura = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, bufTextura);
  // gl.bufferData(gl.ARRAY_BUFFER, flatten(alvo.tex), gl.STATIC_DRAW);

  // var aTexCoord = gl.getAttribLocation(gShader.program, "aTexCoord");
  // gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(aTexCoord);
  configureTexturaDaURL4(URL_CAMISA);
configureTexturaDaURL3(URL_RAQUETE); 
configureTexturaDaURL2(URL_CHAO); 
configureTexturaDaURL(URL_ALVO); 
  gl.uniform1i(gl.getUniformLocation(gShader.program, "uTextureMap"), 0);

};

// ==================================================================
/**
 * Usa o shader para desenhar.
 * Assume que os dados já foram carregados e são estáticos.
 */
function render() {
  if (perdeu) {
    
    return; 
  }
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if(!perdeu) {
    let narizLocal = vec4(0, 0, -1, 1);
    let modelAgulha = mat4();
    modelAgulha = mult(modelAgulha, translate(esfera[BOLHA_NUMERO].translatex, esfera[BOLHA_NUMERO].translatey, esfera[BOLHA_NUMERO].translatez));
    modelAgulha = mult(modelAgulha, scale(esfera[BOLHA_NUMERO].scalepar, esfera[BOLHA_NUMERO].scalepar, esfera[BOLHA_NUMERO].scalepar));
    modelAgulha = mult(modelAgulha, rotate(-esfera[BOLHA_NUMERO].theta[EIXO_X_IND], EIXO_X));
    modelAgulha = mult(modelAgulha, rotate(-esfera[BOLHA_NUMERO].theta[EIXO_Y_IND], EIXO_Y));
    modelAgulha = mult(modelAgulha, rotate(-esfera[BOLHA_NUMERO].theta[EIXO_Z_IND], EIXO_Z));
    
    let narizGlobal = mult(modelAgulha, narizLocal);

    let angX = esfera[BOLHA_NUMERO].theta[EIXO_X_IND] * Math.PI / 180.0;
    let angY = esfera[BOLHA_NUMERO].theta[EIXO_Y_IND] * Math.PI / 180.0;
    let dir = vec3(
      Math.sin(angY) * Math.cos(angX),
      -Math.sin(angX),
      -Math.cos(angY) * Math.cos(angX)
    );
    let eye = vec3(narizGlobal[0], narizGlobal[1], narizGlobal[2]);
    let at = add(eye, dir);

    gCtx.view = lookAt(eye, at, AGULHA_INIT.up);
    gl.uniformMatrix4fv(gShader.uView, false, flatten(gCtx.view));

    //Renderiza o chão
    for (let i = 0; i < chao.length; i++) {
      let cubo = chao[i];
      let model = mat4();
      model = mult(model, translate(cubo.translatex, cubo.translatey, cubo.translatez));
      model = mult(model, scale(cubo.scaleparx, cubo.scalepary, cubo.scaleparz));
      model = mult(model, rotate(-cubo.theta[EIXO_X_IND], EIXO_X));
      model = mult(model, rotate(-cubo.theta[EIXO_Y_IND], EIXO_Y));
      model = mult(model, rotate(-cubo.theta[EIXO_Z_IND], EIXO_Z));
      cubo.render(model, gCtx.view, gShader, true);
    }
    for (let i = 0; i < tijolos.length; i++) {
      let cubo = tijolos[i];
      if (!cubo) continue; 
      let model = mat4();
      model = mult(model, translate(cubo.translatex, cubo.translatey, cubo.translatez));
      model = mult(model, scale(cubo.scaleparx, cubo.scalepary, cubo.scaleparz));
      model = mult(model, rotate(-cubo.theta[EIXO_X_IND], EIXO_X));
      model = mult(model, rotate(-cubo.theta[EIXO_Y_IND], EIXO_Y));
      model = mult(model, rotate(-cubo.theta[EIXO_Z_IND], EIXO_Z));
      cubo.render(model, gCtx.view, gShader);
    }
    // Renderiza o boneco
    for (let i = 0; i < boneco.length; i++) {
      let model = mat4();
      model = mult(model, translate(boneco[i].translatex, boneco[i].translatey, boneco[i].translatez));
      model = mult(model, scale(boneco[i].scaleparx, boneco[i].scalepary, boneco[i].scaleparz));
      model = mult(model, rotate(-boneco[i].theta[EIXO_X_IND], EIXO_X));
      model = mult(model, rotate(-boneco[i].theta[EIXO_Y_IND], EIXO_Y));
      model = mult(model, rotate(-boneco[i].theta[EIXO_Z_IND], EIXO_Z));
      if (i == 1) boneco[i].render(model, gCtx.view, gShader,true, true);
      if (i == 7) boneco[i].render(model, gCtx.view, gShader,true, false);
      else boneco[i].render(model, gCtx.view, gShader);
      if (i < 7)boneco[i].sombra(model, gCtx.view, gShader);
    }
    // Renderiza a(s) bola(s) de tênis
    for (let i = 0; i < bola.length; i++) {
      bola[i].translada();
      let model = mat4();
      model = mult(model, translate(bola[i].translatex, bola[i].translatey, bola[i].translatez));
      model = mult(model, scale(bola[i].scaleparx, bola[i].scalepary, bola[i].scaleparz));
      model = mult(model, rotate(-bola[i].theta[EIXO_X_IND], EIXO_X));
      model = mult(model, rotate(-bola[i].theta[EIXO_Y_IND], EIXO_Y));
      model = mult(model, rotate(-bola[i].theta[EIXO_Z_IND], EIXO_Z));
      bola[i].render(model, gCtx.view, gShader);
    }
     
  

    // Renderiza o alvo circular azul
    if (alvo) {
      let model = mat4();
      model = mult(model, translate(alvo.translatex, alvo.translatey, alvo.translatez));
      model = mult(model, scale(alvo.scaleparx, alvo.scalepary, alvo.scaleparz));
      alvo.render(model, gCtx.view, gShader, true, true);
    }

  // Animação da raquetada
  if (raquetada) {
    if (anguloBracoD < 90) {
      anguloBracoD += 6;
      atualizaBracoRaquete(anguloBracoD);
    } else {
      raquetada = false;
      raquetadaRetorno = true;
    }
  } else if (raquetadaRetorno) {
    if (anguloBracoD > -30) { 
      anguloBracoD -= 6;
      atualizaBracoRaquete(anguloBracoD);
    } else {
      raquetadaRetorno = false;
      anguloBracoD = -30;
      atualizaBracoRaquete(anguloBracoD);
    }
  }
  
}
  window.requestAnimationFrame(render);
}

var gVertexShaderSrc = `#version 300 es

in  vec4 aPosition;
in  vec3 aNormal;
in vec2 aTexCoord;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uPerspective;
uniform mat4 uInverseTranspose;

uniform vec4 uLuzPos;

out vec3 vNormal;
out vec3 vLight;
out vec3 vView;
out vec2 vTexCoord;
void main() {
    mat4 modelView = uView * uModel;
    gl_Position = uPerspective * modelView * aPosition;
    vNormal = mat3(uInverseTranspose) * aNormal;
    vec4 pos = modelView * aPosition;
    vLight = (uView * uLuzPos - pos).xyz;
    vView = -(pos.xyz);
    vTexCoord = aTexCoord;
}
`;

var gFragmentShaderSrc = `#version 300 es

precision highp float;

in vec3 vNormal;
in vec3 vLight;
in vec3 vView;
in vec2 vTexCoord;
out vec4 corSaida;
uniform sampler2D uTextureMap;




uniform vec4 uCorAmbiente;
uniform vec4 uCorDifusao;
uniform vec4 uCorEspecular;
uniform float uAlfaEsp;
uniform bvec3 uUsaTextura;

void main() {
    vec3 normalV = normalize(vNormal);
    vec3 lightV = normalize(vLight);
    vec3 viewV = normalize(vView);
    vec3 halfV = normalize(lightV + viewV);
    vec4 baseColor;
   
    if (uUsaTextura[0]) {
       baseColor =  texture(uTextureMap, vTexCoord);
    } else {
        baseColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    vec4 ambiente = uCorAmbiente * baseColor;
    float kd = max(0.0, dot(normalV, lightV));
    vec4 difusao = kd * uCorDifusao * baseColor;
    float ks = pow( max(0.0, dot(normalV, halfV)), uAlfaEsp);
    vec4 especular = vec4(0, 0, 0, 1);
    if (kd > 0.0) {
        especular = ks * uCorEspecular;
    }
    corSaida = ambiente + difusao + especular;
    corSaida.a = 1.0;
}
`;
function calcularTexCoord(vertice) {
    let x = vertice[0];
    let y = vertice[1];
    let u = 0.5 + 0.5 * x;
    let v = 0.5 + 0.5 * y;
    return vec2(u, v);
}

function Esfera(ndivisoes, textura = false) {
  this.np = 0; 
  this.pos = [];
  this.nor = [];
  this.ay = 0;
  this.tex = [];

  this.vrotacao = vec3(
    0,
    0,
    0
  );
  this.vtranslacao = 0.10;
  this.axis =Math.floor(randomRange(0, 3)); 
  this.theta = vec3(0, 0, 0);
  this.rodando = true;
  this.mat = {
    amb: vec4 (randomRange(0.0, 1.0), randomRange(0.0, 1.0), randomRange(0.0, 1.0), 1.0),
    dif: vec4 (randomRange(0.0, 1.0), randomRange(0.0, 1.0), randomRange(0.0, 1.0), 1.0),
    alfa: randomRange(BOLHA_PHONG_ALFA_MIN, BOLHA_PHONG_ALFA_MAX)
  }
  this.translatex = randomRange(BOLHA_MIN_POS, BOLHA_MAX_POS);
  this.translatey = randomRange(BOLHA_MIN_POS, BOLHA_MAX_POS);
  this.translatez = randomRange(BOLHA_MIN_POS, BOLHA_MAX_POS);
  this.scalepar = randomRange(BOLHA_MIN_RAIO, BOLHA_MAX_RAIO);
  const vp = [
    vec3(1.0, 0.0, 0.0),
    vec3(0.0, 1.0, 0.0),
    vec3(0.0, 0.0, 1.0),
  ];
  const vn = [
    vec3(-1.0, 0.0, 0.0),
    vec3(0.0, -1.0, 0.0),
    vec3(0.0, 0.0, -1.0),
  ];
  const triangulos = [
    [vp[0], vp[1], vp[2]],
    [vp[0], vp[1], vn[2]],
    [vp[0], vn[1], vp[2]],
    [vp[0], vn[1], vn[2]],
    [vn[0], vp[1], vp[2]],
    [vn[0], vp[1], vn[2]],
    [vn[0], vn[1], vp[2]],
    [vn[0], vn[1], vn[2]],
  ];
  function dividaTriangulo(a, b, c, n) {
    if (n > 0) {
      let ab = normalize(mix(a, b, 0.5));
      let bc = normalize(mix(b, c, 0.5));
      let ca = normalize(mix(c, a, 0.5));
      dividaTriangulo(a, ab, ca, n - 1);
      dividaTriangulo(b, bc, ab, n - 1);
      dividaTriangulo(c, ca, bc, n - 1);
      dividaTriangulo(ab, bc, ca, n - 1);
    } else {
      insereTriangulo(a, b, c);
    }
  }
  const insereTriangulo = (a, b, c) => {
    this.pos.push(vec4(a[0], a[1], a[2], 1.0));
    this.nor.push(normalize(a));
    this.pos.push(vec4(b[0], b[1], b[2], 1.0));
    this.nor.push(normalize(b));
    this.pos.push(vec4(c[0], c[1], c[2], 1.0));
    this.nor.push(normalize(c));
    this.np += 3;
    if (textura) {
      this.tex.push(calcularTexCoord(a));
      this.tex.push(calcularTexCoord(b));
      this.tex.push(calcularTexCoord(c));
    }
  };
  for (let i = 0; i < triangulos.length; i++) {
    let [a, b, c] = triangulos[i];
    dividaTriangulo(a, b, c, ndivisoes);
  }
  this.bufVertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufVertices);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(this.pos), gl.STATIC_DRAW);
  this.bufNormais = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNormais);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(this.nor), gl.STATIC_DRAW);

  this.bolaEmContatoRaquete = false;
  this.ultimoTempoContatoRaquete = 0;
  this.intervaloContatoRaquete = 200; 

  
  this.translada = function(){
    if (bola.includes(this)) {
      this.translatex += this.vrotacao[0] * this.vtranslacao;
      this.translatez += this.vrotacao[2] * this.vtranslacao; 
     
      this.vrotacao[1] += this.ay; 
      this.translatey += this.vrotacao[1];

      let yChao = chao[0].translatey + chao[0].scalepary/2;
      if (this.translatey - this.scalepary <= yChao) {
        this.translatey = yChao + this.scalepary; 
        this.vrotacao[1] *= -0.7; 
      }

      if (
        this.translatez - this.scaleparz <= 0 &&
        this.translatex + this.scaleparx >= paredeMinX && this.translatex - this.scaleparx <= paredeMaxX &&
        this.translatey + this.scalepary >= paredeMinY && this.translatey - this.scalepary <= paredeMaxY
      ) {
        let xIdx = Math.floor((this.translatex - paredeMinX) / (LADO_TIJOLO + DIST_X));
        let yIdx = Math.floor((this.translatey - paredeMinY) / (LADO_TIJOLO + DIST_Y));
        let idxCentral = yIdx * LARGURA_TIJOLOS + xIdx;
        if (!tijolos[idxCentral]) {
          if (!perdeu) {
            perdeu = true;
            mostrarMensagemPerda();
          }
          return;
        }
        let refletiu = false;
       
        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            let nx = xIdx + dx;
            let ny = yIdx + dy;
            if (nx >= 0 && nx < LARGURA_TIJOLOS && ny >= 0 && ny < ALTURA_TIJOLOS) {
              let idx = ny * LARGURA_TIJOLOS + nx;
              let tijolo = tijolos[idx];
              if (tijolo) {
                let amb = tijolo.mat.amb;
                tijolo.mat.amb = vec4(
                  Math.max(0, amb[0] - 0.2),
                  Math.max(0, amb[1] - 0.2),
                  Math.max(0, amb[2] - 0.2),
                  amb[3]
                );
                tijolo.mat.dif = vec4(0.3, 0.3, 0.3, 1.0);
                
                if (tijolo.mat.amb[0] === 0 && tijolo.mat.amb[1] === 0 && tijolo.mat.amb[2] === 0) {
                  tijolos[idx] = null;
                }
                refletiu = true;
              }
            }
          }
        }
        for (let dy = -1; dy < 3; dy++) {
          for (let dx = -1; dx < 3; dx++) {
         
            if (dx >= 0 && dx < 2 && dy >= 0 && dy < 2) continue;
            let nx = xIdx + dx;
            let ny = yIdx + dy;
            if (nx >= 0 && nx < LARGURA_TIJOLOS && ny >= 0 && ny < ALTURA_TIJOLOS) {
              let idx = ny * LARGURA_TIJOLOS + nx;
              let tijolo = tijolos[idx];
              if (tijolo) {
                let amb = tijolo.mat.amb;
                tijolo.mat.amb = vec4(
                  Math.max(0, amb[0] - 0.1),
                  Math.max(0, amb[1] - 0.1),
                  Math.max(0, amb[2] - 0.1),
                  amb[3]
                );
                tijolo.mat.dif = vec4(0.3, 0.3, 0.3, 1.0);
                if (tijolo.mat.amb[0] === 0 && tijolo.mat.amb[1] === 0 && tijolo.mat.amb[2] === 0) {
                  tijolos[idx] = null;
                }
              }
            }
          }
        }
        for (let dy = -2; dy < 4; dy++) {
          for (let dx = -2; dx < 4; dx++) {
            
            if (dx >= -1 && dx < 3 && dy >= -1 && dy < 3) continue;
            let nx = xIdx + dx;
            let ny = yIdx + dy;
            if (nx >= 0 && nx < LARGURA_TIJOLOS && ny >= 0 && ny < ALTURA_TIJOLOS) {
              let idx = ny * LARGURA_TIJOLOS + nx;
              let tijolo = tijolos[idx];
              if (tijolo) {
                let amb = tijolo.mat.amb;
                tijolo.mat.amb = vec4(
                  Math.max(0, amb[0] - 0.05),
                  Math.max(0, amb[1] - 0.05),
                  Math.max(0, amb[2] - 0.05),
                  amb[3]
                );
                tijolo.mat.dif = vec4(0.3, 0.3, 0.3, 1.0);
                if (tijolo.mat.amb[0] === 0 && tijolo.mat.amb[1] === 0 && tijolo.mat.amb[2] === 0) {
                  tijolos[idx] = null;
                }
              }
            }
          }
        }
        if (refletiu) {
          this.translatez = 0 + this.scaleparz;
          this.vrotacao[2] *= -1;
        }
      }
      if (this.translatez + this.scaleparz < 0 && !perdeu) {
        perdeu = true;
        mostrarMensagemPerda();
      }
      if (this.translatez > posBonecoGlobal.z + 15 && !perdeu) {
        perdeu = true;
        mostrarMensagemPerda();
      }
      let cabecaRaquete = boneco[7];
      if (cabecaRaquete) {
        let dx = this.translatex - cabecaRaquete.translatex;
        let dz = this.translatez - cabecaRaquete.translatez;
        let distXZ = Math.sqrt(dx*dx + dz*dz);
        let raioSoma = this.scaleparx + cabecaRaquete.scaleparx;
        let agora = Date.now();
        if (distXZ < raioSoma) {
          if (!this.bolaEmContatoRaquete && (agora - this.ultimoTempoContatoRaquete > this.intervaloContatoRaquete)) {
            console.log("Contato no ponto = " + cabecaRaquete.translatez);
            this.bolaEmContatoRaquete = true;
            this.ultimoTempoContatoRaquete = agora;
            this.vrotacao[2] *= -1; 
            let referenciaZ = 278;
            let maxLateral = 2.5;
            let deltaZ = cabecaRaquete.translatez - referenciaZ;
            this.vrotacao[0] = Math.max(-maxLateral, Math.min(maxLateral, deltaZ/8)) * 1.5;
            this.vrotacao[1] = 0.7;
            this.translatez = cabecaRaquete.translatez + Math.sign(this.vrotacao[2]) * raioSoma;
          }
        } else {
          this.bolaEmContatoRaquete = false;
        }
      }
    } else if (this === esfera[BOLHA_NUMERO]) {
     
      let angX = this.theta[EIXO_X_IND] * Math.PI / 180.0;
      let angY = this.theta[EIXO_Y_IND] * Math.PI / 180.0;
      let dir = vec3(
        Math.sin(angY) * Math.cos(angX),
        -Math.sin(angX),
        -Math.cos(angY) * Math.cos(angX)
      );
      this.translatex += this.vtranslacao * dir[0];
      this.translatey += this.vtranslacao * dir[1];
    } else {
      this.translatez -= this.vtranslacao; 
      if (this.translatez < BOLHA_MIN_POS) {
        this.translatez = BOLHA_MAX_POS;
      }
    }


   
      if (alvo) {
        let dx = this.translatex - alvo.translatex;
        let dy = this.translatey - alvo.translatey;
        let distXY = Math.sqrt(dx*dx + dy*dy);
        let raioBola = this.scaleparx;
        let raioAlvo = alvo.scaleparx;
        
          
        
        if (distXY < raioBola + raioAlvo &&
            Math.abs(this.translatez - alvo.translatez) < this.scaleparz + alvo.scaleparz) {
          console.log("COLIDIU COM O ALVO!");
          n_pontos++;
          atualizarPontuacao();
          
          this.vrotacao[2] *= -1;
          this.translatez = alvo.translatez + Math.sign(this.vrotacao[2]) * (this.scaleparz + alvo.scaleparz + 0.1);
         
          let minX = paredeMinX + 35;
          let maxX = paredeMaxX - 35;
          alvo.translatex = randomRange(minX, maxX);
          console.log("PONTOS=", n_pontos);
        }
      }
  }
  this.render = function(model, view, shader, textura=false, isAlvo = false) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufVertices);
    var aPosition = gl.getAttribLocation(shader.program, "aPosition");
    gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNormais);
    var aNormal = gl.getAttribLocation(shader.program, "aNormal");
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aNormal);
    gl.uniform4fv(shader.uCorAmb, mult(LUZ.amb, this.mat.amb));
    gl.uniform4fv(shader.uCorDif, mult(LUZ.dif, this.mat.dif));
    gl.uniform4fv(shader.uCorEsp, LUZ.esp);
    gl.uniform1f(shader.uAlfaEsp, this.mat.alfa);
    gl.uniformMatrix4fv(shader.uModel, false, flatten(model));
    let modelView = mult(view, model);
    let modelViewInv = inverse(modelView);
    let modelViewInvTrans = transpose(modelViewInv);
    gl.uniformMatrix4fv(shader.uInverseTranspose, false, flatten(modelViewInvTrans));
    if (textura) {
      if (isAlvo){
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texturaAlvo);
        gl.uniform1i(gl.getUniformLocation(shader.program, "uTextureMap"), 0);}
      else{
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, texturaRaquete);
        gl.uniform1i(gl.getUniformLocation(shader.program, "uTextureMap"), 2);
      }
      var bufTextura = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, bufTextura);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(this.tex), gl.STATIC_DRAW);
      var aTexCoord = gl.getAttribLocation(shader.program, "aTexCoord");
      gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aTexCoord);
      gl.uniform3iv(gl.getUniformLocation(shader.program, "uUsaTextura"), [1,0,0]); // alvo
    } else {
      gl.uniform3iv(gl.getUniformLocation(shader.program, "uUsaTextura"), [0,0,0]);
      gl.disableVertexAttribArray(gl.getAttribLocation(shader.program, "aTexCoord"));
    }
    gl.drawArrays(gl.TRIANGLES, 0, this.np);
    
   
    let mSombra = mat4();
    mSombra[0][1] = -LUZ.pos[0] / LUZ.pos[1];
    mSombra[1][1] = 0;
    mSombra[2][1] = -LUZ.pos[2] / LUZ.pos[1];
    mSombra[3][1] = 0;
    let deslocamentoSombra = translate(0, -61, 0); 
    let modelSombra = mult(mSombra, model);
    modelSombra = mult(deslocamentoSombra, modelSombra);
    let modelViewSombra = mult(view, modelSombra);

    let sombraY = modelSombra[1][3];
    gl.uniformMatrix4fv(shader.uModel, false, flatten(mat4()));
    gl.uniformMatrix4fv(shader.uView, false, flatten(modelViewSombra));
    gl.uniform4fv(shader.uCorAmb, vec4(0,0,0,1));
    gl.uniform4fv(shader.uCorDif, vec4(0,0,0,1));
    gl.uniform4fv(shader.uCorEsp, vec4(0,0,0,1));
    gl.uniform1f(shader.uAlfaEsp, 0.0);
    gl.drawArrays(gl.TRIANGLES, 0, this.np);
    gl.uniformMatrix4fv(shader.uView, false, flatten(view));
  };
}

function Cubo() {
  this.np = 36;
  this.pos = []; 
  this.nor = []; 
  this.tex = [];
  this.translatex = 0;
  this.translatey = 0;
  this.translatez = 0;
  this.scaleparx = 1;
  this.scalepary = 1;
  this.scaleparz = 1;
  this.axis = EIXO_Z_IND; 
  this.theta = vec3(0, 0, 0);  
  this.rodando = true;        
  this.mat = {
    amb: vec4(0.8, 0.8, 0.8, 1.0),
    dif: vec4(1.0, 0.0, 1.0, 1.0),
    alfa: 50.0
  };
 
  const CUBO_CANTOS = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
  ];

  const FACE_TEX = [
    vec2(0,0), vec2(0,1), vec2(1,1), vec2(1,0)
  ];
  function quad(pos, nor, tex, vert, a, b, c, d) {
    var t1 = subtract(vert[b], vert[a]);
    var t2 = subtract(vert[c], vert[b]);
    var normal = cross(t1, t2);
    normal = vec3(normal);
    
    pos.push(vert[a]); nor.push(normal); tex.push(FACE_TEX[0]);
    pos.push(vert[b]); nor.push(normal); tex.push(FACE_TEX[1]);
    pos.push(vert[c]); nor.push(normal); tex.push(FACE_TEX[2]);
   
    pos.push(vert[a]); nor.push(normal); tex.push(FACE_TEX[0]);
    pos.push(vert[c]); nor.push(normal); tex.push(FACE_TEX[2]);
    pos.push(vert[d]); nor.push(normal); tex.push(FACE_TEX[3]);
  }
 
  quad(this.pos, this.nor, this.tex, CUBO_CANTOS, 1, 0, 3, 2);
  quad(this.pos, this.nor, this.tex, CUBO_CANTOS, 2, 3, 7, 6);
  quad(this.pos, this.nor, this.tex, CUBO_CANTOS, 3, 0, 4, 7);
  quad(this.pos, this.nor, this.tex, CUBO_CANTOS, 6, 5, 1, 2);
  quad(this.pos, this.nor, this.tex, CUBO_CANTOS, 4, 5, 6, 7);
  quad(this.pos, this.nor, this.tex, CUBO_CANTOS, 5, 4, 0, 1);
  this.bufVertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufVertices);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(this.pos), gl.STATIC_DRAW);
  this.bufNormais = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNormais);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(this.nor), gl.STATIC_DRAW);
  this.bufTextura = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTextura);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(this.tex), gl.STATIC_DRAW);
  this.translada = function() {
  
  };
  this.render = function(model, view, shader, textura=false, isCamisa = false) {
    if (textura) {
      if(!isCamisa){
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texturaQuadra); 
        gl.uniform1i(gl.getUniformLocation(shader.program, "uTextureMap"), 1);}
      else{
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, texturaCamisa);
        gl.uniform1i(gl.getUniformLocation(shader.program, "uTextureMap"), 3);}
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTextura);
      var aTexCoord = gl.getAttribLocation(shader.program, "aTexCoord");
      gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aTexCoord);
      gl.uniform3iv(gl.getUniformLocation(shader.program, "uUsaTextura"), [1,1,0]);
    } else {
      gl.uniform3iv(gl.getUniformLocation(shader.program, "uUsaTextura"), [0,0,0]);
      gl.disableVertexAttribArray(gl.getAttribLocation(shader.program, "aTexCoord"));
      gl.uniform1i(gl.getUniformLocation(shader.program, "uTextureMap"), 0);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufVertices);
    var aPosition = gl.getAttribLocation(shader.program, "aPosition");
    gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNormais);
    var aNormal = gl.getAttribLocation(shader.program, "aNormal");
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aNormal);
    gl.uniform4fv(shader.uCorAmb, mult(LUZ.amb, this.mat.amb));
    gl.uniform4fv(shader.uCorDif, mult(LUZ.dif, this.mat.dif));
    gl.uniform4fv(shader.uCorEsp, LUZ.esp);
    gl.uniform1f(shader.uAlfaEsp, this.mat.alfa);
    gl.uniformMatrix4fv(shader.uModel, false, flatten(model));
    let modelView = mult(view, model);
    let modelViewInv = inverse(modelView);
    let modelViewInvTrans = transpose(modelViewInv);
    gl.uniformMatrix4fv(shader.uInverseTranspose, false, flatten(modelViewInvTrans));
    gl.drawArrays(gl.TRIANGLES, 0, this.np);
  };
  this.sombra = function(model, view, shader){
    let mSombra = mat4();
    mSombra[0][1] = -LUZ.pos[0] / LUZ.pos[1];
    mSombra[1][1] = 0;
    mSombra[2][1] = -LUZ.pos[2] / LUZ.pos[1];
    mSombra[3][1] = 0;
    
    let deslocamentoSombra = translate(0, -61, 0); 
   
    let modelSombra = mult(mSombra, model);
    modelSombra = mult(deslocamentoSombra, modelSombra);
    let modelViewSombra = mult(view, modelSombra);
 
    let sombraY = modelSombra[1][3];

    gl.uniformMatrix4fv(shader.uModel, false, flatten(mat4()));
    gl.uniformMatrix4fv(shader.uView, false, flatten(modelViewSombra));
 
    gl.uniform4fv(shader.uCorAmb, vec4(0,0,0,1));
    gl.uniform4fv(shader.uCorDif, vec4(0,0,0,1));
    gl.uniform4fv(shader.uCorEsp, vec4(0,0,0,1));
    gl.uniform1f(shader.uAlfaEsp, 0.0);
    gl.drawArrays(gl.TRIANGLES, 0, this.np);
    gl.uniformMatrix4fv(shader.uView, false, flatten(view));
  }
}

var texturaQuadra = null;

function configureTexturaDaURL2(url) {
  var texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([0, 255, 0, 255])); // verde temporário
  var img = new Image();
  img.src = url;
  img.crossOrigin = "anonymous";
  img.addEventListener('load', function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, img.width, img.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    texturaQuadra = texture; 
  });
  return texture;
};


var texturaRaquete = null;

function configureTexturaDaURL3(url) {
  var texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([0, 255, 0, 255])); // verde temporário
  var img = new Image();
  img.src = url;
  img.crossOrigin = "anonymous";
  img.addEventListener('load', function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, img.width, img.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    texturaRaquete = texture; 
  });
  return texture;
};

var texturaCamisa = null;
function configureTexturaDaURL4(url) {
  var texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([0, 255, 0, 255])); // verde temporário
  var img = new Image();
  img.src = url;
  img.crossOrigin = "anonymous";
  img.addEventListener('load', function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, img.width, img.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    texturaCamisa = texture; 
  });
  return texture;
};
function checaColisaoAgulhaBolhas() {
  let narizLocal = vec4(0, 0, -1, 1);
  let modelAgulha = mat4();
  modelAgulha = mult(modelAgulha, translate(esfera[BOLHA_NUMERO].translatex, esfera[BOLHA_NUMERO].translatey, esfera[BOLHA_NUMERO].translatez));
  modelAgulha = mult(modelAgulha, scale(esfera[BOLHA_NUMERO].scalepar, esfera[BOLHA_NUMERO].scalepar, esfera[BOLHA_NUMERO].scalepar));
  modelAgulha = mult(modelAgulha, rotate(-esfera[BOLHA_NUMERO].theta[EIXO_X_IND], EIXO_X));
  modelAgulha = mult(modelAgulha, rotate(-esfera[BOLHA_NUMERO].theta[EIXO_Y_IND], EIXO_Y));
  modelAgulha = mult(modelAgulha, rotate(-esfera[BOLHA_NUMERO].theta[EIXO_Z_IND], EIXO_Z));
  let narizGlobal = mult(modelAgulha, narizLocal);
  let eye = vec3(narizGlobal[0], narizGlobal[1], narizGlobal[2]);

  for (let i = 0; i < BOLHA_NUMERO; i++) {
    let bolha = esfera[i];
    let centro = vec3(bolha.translatex, bolha.translatey, bolha.translatez);
    let dist = length(subtract(eye, centro));
    let somaRaios = bolha.scalepar + esfera[BOLHA_NUMERO].scalepar;
    if (dist < somaRaios) {
      console.log('Colisão com bolha', i);
      return i;
    }
  }
  return -1; 
}

function atualizaBracoRaquete(angulo) {
  let bracoD = boneco[3];
  let caboRaquete = boneco[6];
  let cabecaRaquete = boneco[7]; 
  if (!bracoD || !caboRaquete || !cabecaRaquete) return;

  let ombroX = posBonecoGlobal.x + larguraTorsoGlobal/2;
  let ombroY = posBonecoGlobal.y;
  let ombroZ = posBonecoGlobal.z;

  let desloc = (alturaBracoGlobal * 0.8) / 2; 

  bracoD.translatex = ombroX + desloc/2;
  bracoD.translatey = ombroY;
  bracoD.translatez = ombroZ;
  bracoD.theta = vec3(0, angulo, 0); 

  let maoX = ombroX + desloc * Math.cos(radians(angulo));
  let maoY = ombroY;
  let maoZ = ombroZ - desloc * Math.sin(radians(angulo));

  let caboCompr = caboRaquete.scaleparx;
  caboRaquete.translatex = maoX + (caboCompr/2) * Math.cos(radians(angulo));
  caboRaquete.translatey = maoY;
  caboRaquete.translatez = maoZ - (caboCompr/2) * Math.sin(radians(angulo));
  caboRaquete.theta = vec3(0, angulo, 0); 

  let cabecaCompr = cabecaRaquete.scaleparx;
  cabecaRaquete.translatex = maoX + (caboCompr/2 + cabecaCompr) * Math.cos(radians(angulo));
  cabecaRaquete.translatey = maoY;
  cabecaRaquete.translatez = maoZ - (caboCompr/2 + cabecaCompr) * Math.sin(radians(angulo));
  cabecaRaquete.theta = vec3(0, angulo, 0);
}

function atualizarPontuacao() {
  const div = document.getElementById('pontuacao');
  if (div) div.textContent = `Pontos: ${n_pontos}`;
}

var texturaAlvo = null;
function configureTexturaDaURL(url) {
  // cria a textura
  var texture = gl.createTexture();
  // seleciona a unidade TEXTURE0
  gl.activeTexture(gl.TEXTURE0);
  // ativa a textura
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Carrega uma textura de um pixel 1x1 vermelho, temporariamente
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([255, 0, 0, 255]));

  // Carraga a imagem da URL: 
  // veja https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
  var img = new Image(); // cria um bitmap
  img.src = url;
  img.crossOrigin = "anonymous";
  // espera carregar = evento "load"
  img.addEventListener('load', function () {
    console.log("Carregou imagem", img.width, img.height);
    // depois de carregar, copiar para a textura
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, img.width, img.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    texturaAlvo = texture; // agora texturaAlvo recebe a textura criada
    // experimente usar outros filtros removendo o comentário da linha abaixo.
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  }
  );
  return img;
};



function mostrarMensagemPerda() {
  let div = document.getElementById('mensagem-perda');
  let canvas = document.getElementById('glcanvas');
  if (!div) {
    div = document.createElement('div');
    div.id = 'mensagem-perda';
    div.style.position = 'absolute';
    div.style.top = (canvas.offsetTop + canvas.height/2) + 'px';
    div.style.left = (canvas.offsetLeft + canvas.width/2) + 'px';
    div.style.transform = 'translate(-50%, -50%)';
    div.style.fontSize = '5vw';
    div.style.fontWeight = 'bold';
    div.style.color = '#fff';
    div.style.background = 'rgba(0,0,0,0.8)';
    div.style.padding = '2vw 4vw';
    div.style.borderRadius = '2vw';
    div.style.zIndex = '9999';
    div.style.textAlign = 'center';
    div.style.pointerEvents = 'none';
    let msg1 = document.createElement('div');
    msg1.textContent = 'Você perdeu!';
    msg1.style.marginBottom = '1vw';
    let msg2 = document.createElement('div');
    msg2.textContent = 'Clique para jogar novamente';
    msg2.style.fontSize = '2vw';
    msg2.style.fontFamily = 'Arial, sans-serif';
    msg2.style.fontWeight = 'normal';
    msg2.style.color = '#fff';
    div.appendChild(msg1);
    div.appendChild(msg2);
    canvas.parentElement.appendChild(div);
  } else {
    div.style.display = 'block';
  }
}