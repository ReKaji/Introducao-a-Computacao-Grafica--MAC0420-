/* 

EP3 de MAC0420/MAC5744 - Bolhas x Agulha

Autor: Renan Ryu Kajihara
Data: 12/06/2025
Comentários: essa solução foi baseada nos capítulos 15 a 18 do material do curso
*/

"use strict";

// ==================================================================
// Os valores a seguir são usados apenas uma vez quando o programa
// é carregado. Modifique esses valores para ver seus efeitos.

// calcula a matriz de transformação da camera, apenas 1 vez
const eye = vec3(2, 2, 0);
const at = vec3(0, 0, 0);
const up = vec3(0, 1, 0);

// Propriedades da fonte de luz
// ==================================================================
/*
    Esse arquivo contém algumas constantes que usei
    na preparação do demo do EP3.
*/

// ==================================================================
/* Funções auxiliares 
*/
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// ==================================================================

var DEBUG = false;

// BOLHAS
const BOLHA_NUMERO = 20;  // Numero de bolhas na cena
const BOLHA_PHONG_ALFA_MIN = 50;
const BOLHA_PHONG_ALFA_MAX = 500;
const BOLHA_MIN_VEL = 1;   // translacao em e rotacao por eixo
const BOLHA_MAX_VEL = 5;
const BOLHA_MIN_POS = -100; // posicao em cada eixo
const BOLHA_MAX_POS =  100;
const BOLHA_MIN_RAIO = 10;
const BOLHA_MAX_RAIO = 30;
const BOLHA_MIN_RESOLUCAO = 0;  // balão
const BOLHA_MAX_RESOLUCAO = 4;  // esfera

// cor de fundo
const COR_CLEAR = [0.2, 0.2, 0.6, 1.0];

// Propriedades da fonte de luz
const LUZ = {
    pos : vec4(50.0, 50.0, 150.0, 1.0), // posição
    amb : vec4(0.47, 0.47, 0.47, 1.0), // ambiente
    dif : vec4(0.68, 0.68, 0.68, 1.0), // difusãos
    esp : vec4(0.39, 0.39, 0.39, 1.0), // especular
};

const MAT = {
  amb: vec4(0.8, 0.8, 0.8, 1.0),
  dif: vec4(1.0, 0.0, 1.0, 1.0),
  alfa: 50.0,    // brilho ou shininess
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
// Camera
const FOVY = 60;
const ASPECT = 1;
const NEAR = 0.1;
const FAR = 50;

// ==================================================================
// constantes globais

const FUNDO = [0.2, 0.2, 0.6, 1.0];
const EIXO_X_IND = 0;
const EIXO_Y_IND = 1;
const EIXO_Z_IND = 2;
const EIXO_X = vec3(1, 0, 0);
const EIXO_Y = vec3(0, 1, 0);
const EIXO_Z = vec3(0, 0, 1);

// ==================================================================
// variáveis globais
// as strings com os código dos shaders também são globais, estão 
// no final do arquivo.

var gl;        // webgl2
var gCanvas;   // canvas


var pausado = false;
var passo = 0;

var esfera = []; 

// guarda coisas do shader
var gShader = {
  aTheta: null,
};

// guarda coisas da interface e contexto do programa
var gCtx = {
  view: mat4(),     // view matrix, inicialmente identidade
  perspective: mat4(), // projection matrix
};

// ==================================================================
// chama a main quando terminar de carregar a janela
window.onload = main;

/**
 * programa principal.
 */
function main() {
  // ambiente
  gCanvas = document.getElementById("glcanvas");
  gl = gCanvas.getContext('webgl2');
  if (!gl) alert("Vixe! Não achei WebGL 2.0 aqui :-(");

  console.log("Canvas: ", gCanvas.width, gCanvas.height);

  
  // interface
  crieInterface();

  // objeto
  //esfera1.init();

  // Inicializações feitas apenas 1 vez
  gl.viewport(0, 0, gCanvas.width, gCanvas.height);
  gl.clearColor(FUNDO[0], FUNDO[1], FUNDO[2], FUNDO[3]);
  gl.enable(gl.DEPTH_TEST);

    for (let i = 0; i < BOLHA_NUMERO; i++) {
        esfera[i] = new Esfera(randomRange(BOLHA_MIN_RESOLUCAO, BOLHA_MAX_RESOLUCAO));
    }
    esfera[BOLHA_NUMERO] = new Esfera(4); 
    esfera[BOLHA_NUMERO].translatex = AGULHA_INIT.pos[0];
    esfera[BOLHA_NUMERO].translatey = AGULHA_INIT.pos[1];
    esfera[BOLHA_NUMERO].translatez = AGULHA_INIT.pos[2];
    esfera[BOLHA_NUMERO].scalepar = AGULHA_INIT.escala[0];
    esfera[BOLHA_NUMERO].theta = AGULHA_INIT.theta;
    esfera[BOLHA_NUMERO].mat.amb = AGULHA_INIT.cor;
    esfera[BOLHA_NUMERO].mat.dif = AGULHA_INIT.cor;
    esfera[BOLHA_NUMERO].mat.alfa = AGULHA_INIT.alfa;
    //esfera[BOLHA_NUMERO].rodando = true; 
    esfera[BOLHA_NUMERO].vtranslacao = AGULHA_INIT.vTrans;
    esfera[BOLHA_NUMERO].vrotacao = vec3(0,0,0);
  // shaders
  crieShaders();

  // finalmente...
  render();
}

// ==================================================================
/**
 * Cria e configura os elementos da interface e funções de callback
 */


function callbackbotao1(e){
  pausado = !pausado;
  if (gInterface.botao1.value == "Executar"){
    gInterface.botao1.value = "Pausar";
  }
  else{
    gInterface.botao1.value= "Executar";
  }
}

function callbackbotao2(e){
  if(pausado){
    passo=1;
  }
}
function crieInterface() {
  window.onkeydown = function (ev) {
    const key = ev.key.toLowerCase();
    
      switch (key) {
        case 'j':
          esfera[BOLHA_NUMERO].vtranslacao -= 0.1;
          console.log("vtranslacao: " + esfera[BOLHA_NUMERO].vtranslacao);
          break;
        case 'l':
          esfera[BOLHA_NUMERO].vtranslacao += 0.1;
          console.log("vtranslacao: " + esfera[BOLHA_NUMERO].vtranslacao);
          break;
        case 'k':
          esfera[BOLHA_NUMERO].vtranslacao= 0;
          console.log("vtranslacao: " + esfera[BOLHA_NUMERO].vtranslacao);
          break;
        case 'w':
          esfera[BOLHA_NUMERO].theta[EIXO_X_IND] -= 0.5;
          
          break;
        case 'x':
          esfera[BOLHA_NUMERO].theta[EIXO_X_IND] += 0.5;
          
          break;
        case 'a':
          esfera[BOLHA_NUMERO].theta[EIXO_Y_IND] -= 0.5;
        
          break;
        case 'd':
          esfera[BOLHA_NUMERO].theta[EIXO_Y_IND] += 0.5;
          break;
        case 'z':
          esfera[BOLHA_NUMERO].theta[EIXO_Z_IND] += 0.5;
          break;
        case 'c':
          esfera[BOLHA_NUMERO].theta[EIXO_Z_IND] -= 0.5;
          break;
        case 's':
          esfera[BOLHA_NUMERO].vrotacao = vec3(0,0,0); 
          break;
      }
    
  }
  gInterface.botao1 = document.getElementById("bRun");
  
  gInterface.botao2 = document.getElementById("bStep");
  gInterface.botao1.onclick = callbackbotao1;
  gInterface.botao2.onclick = callbackbotao2;
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

};

// ==================================================================
/**
 * Usa o shader para desenhar.
 * Assume que os dados já foram carregados e são estáticos.
 */
function render() {
  if (!pausado||passo){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

    for (let i = 0; i < BOLHA_NUMERO+1; i++) {
      if (esfera[i].rodando) esfera[i].theta[0] += esfera[i].vrotacao[0];
      if (esfera[i].rodando) esfera[i].theta[1] += esfera[i].vrotacao[1];
      if (esfera[i].rodando) esfera[i].theta[2] += esfera[i].vrotacao[2];

      let model = mat4();
      model = mult(model, translate(esfera[i].translatex, esfera[i].translatey, esfera[i].translatez));
      model = mult(model, scale(esfera[i].scalepar, esfera[i].scalepar, esfera[i].scalepar));
      model = mult(model, rotate(-esfera[i].theta[EIXO_X_IND], EIXO_X));
      model = mult(model, rotate(-esfera[i].theta[EIXO_Y_IND], EIXO_Y));
      model = mult(model, rotate(-esfera[i].theta[EIXO_Z_IND], EIXO_Z));
      esfera[i].translada(); 
      if (i!=BOLHA_NUMERO) esfera[i].render(model, gCtx.view, gShader);
    }
    let bolhaEstourada = checaColisaoAgulhaBolhas();
    if (bolhaEstourada >= 0) {
      esfera[bolhaEstourada].translatex = randomRange(BOLHA_MIN_POS, BOLHA_MAX_POS);
      esfera[bolhaEstourada].translatey = randomRange(BOLHA_MIN_POS, BOLHA_MAX_POS);
      esfera[bolhaEstourada].translatez = randomRange(BOLHA_MIN_POS, BOLHA_MAX_POS);
      esfera[bolhaEstourada].theta = vec3(0, 0, 0);
      
    }
    if (passo) passo--;
  }

  window.requestAnimationFrame(render);
}

var gVertexShaderSrc = `#version 300 es

in  vec4 aPosition;
in  vec3 aNormal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uPerspective;
uniform mat4 uInverseTranspose;

uniform vec4 uLuzPos;

out vec3 vNormal;
out vec3 vLight;
out vec3 vView;

void main() {
    mat4 modelView = uView * uModel;
    gl_Position = uPerspective * modelView * aPosition;

    // orienta as normais como vistas pela câmera
    vNormal = mat3(uInverseTranspose) * aNormal;
    vec4 pos = modelView * aPosition;

    vLight = (uView * uLuzPos - pos).xyz;
    vView = -(pos.xyz);
}
`;

var gFragmentShaderSrc = `#version 300 es

precision highp float;

in vec3 vNormal;
in vec3 vLight;
in vec3 vView;
out vec4 corSaida;

// cor = produto luz * material
uniform vec4 uCorAmbiente;
uniform vec4 uCorDifusao;
uniform vec4 uCorEspecular;
uniform float uAlfaEsp;

void main() {
    vec3 normalV = normalize(vNormal);
    vec3 lightV = normalize(vLight);
    vec3 viewV = normalize(vView);
    vec3 halfV = normalize(lightV + viewV);
  
    // difusao
    float kd = max(0.0, dot(normalV, lightV) );
    vec4 difusao = kd * uCorDifusao;

    // especular
    float ks = pow( max(0.0, dot(normalV, halfV)), uAlfaEsp);
    
    vec4 especular = vec4(0, 0, 0, 1); // parte não iluminada
    if (kd > 0.0) {  // parte iluminada
        especular = ks * uCorEspecular;
    }
    corSaida = difusao + especular + uCorAmbiente;    
    corSaida.a = 1.0;
}
`;

/**
 * Objeto Esfera de raio 1 centrada na origem.
 * @param {number} ndivisoes - número de divisões (0 = balão)
 */
function Esfera(ndivisoes) {
  this.np = 0; 
  this.pos = [];
  this.nor = [];
  
  this.vrotacao = vec3(
    randomRange(BOLHA_MIN_VEL, BOLHA_MAX_VEL),
    randomRange(BOLHA_MIN_VEL, BOLHA_MAX_VEL),
    randomRange(BOLHA_MIN_VEL, BOLHA_MAX_VEL)
  );
  this.vtranslacao = randomRange(0.05, 0.15);
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

  this.translada = function(){
    
    if (this === esfera[BOLHA_NUMERO]) {
      let angX = this.theta[EIXO_X_IND] * Math.PI / 180.0;
      let angY = this.theta[EIXO_Y_IND] * Math.PI / 180.0;
      let dir = vec3(
        Math.sin(angY) * Math.cos(angX),
        -Math.sin(angX),
        -Math.cos(angY) * Math.cos(angX)
      );
      this.translatex += this.vtranslacao * dir[0];
      this.translatey += this.vtranslacao * dir[1];
      this.translatez += this.vtranslacao * dir[2];
    } else {
      
      this.translatez -= this.vtranslacao; 
      if (this.translatez < BOLHA_MIN_POS) {
        this.translatez = BOLHA_MAX_POS;
      }
    }
  }
  this.render = function(model, view, shader) {
    
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
}

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