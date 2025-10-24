
# Projeto Final - Simulador 3D de Tênis em WebGL

**Disciplina:** MAC0420/MAC5744 - Computação Gráfica

**Autor:** Renan Ryu Kajihara

---

## Resumo
Este projeto é um simulador 3D interativo de tênis, desenvolvido em WebGL2, que explora modelagem, texturização, iluminação e interatividade em tempo real. O sistema permite ao usuário controlar um personagem, rebater uma bola, mirar em alvos e interagir com elementos realistas de uma quadra de tênis.

---

## Introdução
O trabalho consiste em criar um ambiente 3D de tênis, com foco em técnicas de computação gráfica: modelagem de objetos, aplicação de texturas, iluminação, detecção de colisão e animação. O objetivo é proporcionar uma experiência visual rica e interativa, explorando recursos de WebGL e JavaScript.

---

## O que o sistema faz?
Primeiramente, o sistema simula um jogador em uma quadra de tênis 3D, onde há uma parede de tijolos e um alvo posicionado à frente dessa parede. O usuário controla o boneco, podendo movimentá-lo lateralmente e realizar golpes de raquete para rebater a bola. O principal objetivo é acertar o alvo o maior número de vezes possível, utilizando a bola de tênis. Cada vez que a bola atinge o alvo, o jogador marca pontos e o alvo muda de posição, aumentando o desafio. A bola pode quicar no chão, rebater na parede de tijolos (que escurecem e desaparecem com o impacto), e interagir fisicamente com a raquete e o ambiente, proporcionando uma experiência dinâmica e realista. O sistema também apresenta animações suaves, texturização diferenciada para cada objeto e feedback visual para as ações do usuário.

---

## Mini manual do usuário
- **Mover o boneco:** Use as teclas `J` (esquerda) e `L` (direita).
- **Rebater a bola:** Pressione a barra de espaço (`Espaço`).
- **Reiniciar o jogo:** Clique no canvas após perder.
- **Acompanhe a pontuação** no canto da tela.

---

## Como executar o código
1. Certifique-se de ter um navegador moderno com suporte a WebGL2.
2. Abra o arquivo `index.html` da pasta `Projeto_Final` em seu navegador.
3. O sistema será carregado automaticamente e estará pronto para uso.

---

## Como o sistema foi desenvolvido?
O sistema foi desenvolvido em várias etapas, detalhadas a seguir:

- **Modelagem dos objetos:**
  - Todos os elementos da cena (boneco, raquete, bola, alvo, tijolos, chão) foram modelados manualmente utilizando primitivas básicas (cubos e esferas).
    - **Boneco (Jogador):** Composto por cubos para cabeça, torso, braços e pernas, cada um com escala, posição e cor próprias. O torso é um cubo verde vivo, os membros e a cabeça têm tons de pele, e a montagem permite animação independente dos membros.
    - **Raquete:** Formada por um cubo (cabo) e uma esfera achatada (cabeça), conectados ao braço direito do boneco. A cabeça da raquete é texturizada e pode ser animada junto ao braço.
    - **Bola:** Uma esfera com textura, propriedades físicas (velocidade, aceleração, rotação) e lógica de colisão.
    - **Alvo:** Esfera achatada, maior que a bola, posicionada à frente da parede de tijolos, com textura própria e lógica para mudar de posição após acerto.
    - **Chão:** Cubo grande e achatado, texturizado, que serve de base para a quadra.
    - **Tijolos:** Matriz de cubos menores, cada um com cor e estado próprios, permitindo escurecimento e remoção individual após colisões.

- **Implementação das interações do personagem com o usuário:**
  - O usuário pode controlar o boneco lateralmente usando as teclas `j` e `l`, e realizar o movimento de forehand pressionando a barra de espaço. O movimento da raquete é animado por interpolação de ângulo, simulando o golpe real. O sistema também detecta o clique do mouse para reiniciar o jogo após uma derrota.

- **Implementação das interações da bola com os outros objetos:**
  - A bola é lançada e pode colidir com o chão, parede de tijolos, alvo e raquete. A detecção de colisão é feita por bounding box e distância entre centros. Quando a bola atinge o alvo, o jogador marca pontos e o alvo muda de posição. Ao colidir com tijolos, eles escurecem e podem desaparecer após múltiplos impactos. O comportamento da bola após o impacto depende da posição e velocidade, tornando a física mais realista.

- **Adição de luzes de Phong:**
  - O sistema utiliza o modelo de iluminação Phong, que calcula componentes ambiente, difusa e especular para cada fragmento, proporcionando realismo visual com brilho e sombreamento adequados. A posição da luz pode ser ajustada para destacar diferentes áreas da cena.

- **Adição de sombreamento:**
  - Sombreamento é aplicado para reforçar o efeito de profundidade e realismo. As sombras dos objetos são projetadas no chão, acompanhando a posição da fonte de luz, e são desenhadas com cor escura e transparência para simular o efeito de sombra suave.

- **Adição de texturas:**
  - Cada objeto relevante (chão, alvo, bola, raquete) recebe uma textura específica, aplicada via coordenadas UV e múltiplas unidades de textura (GL_TEXTURE0, GL_TEXTURE1, etc). O mapeamento UV foi ajustado para cada modelo, e as texturas são carregadas dinamicamente. Isso permite diferenciar visualmente cada elemento e aumentar a imersão.
  - **Mapeamento de texturas (UV):**
    - **Paralelepípedos (quadra, camisa, chão, tijolos):** O mapeamento UV é feito de forma que cada face do cubo recebe uma fração da textura, utilizando coordenadas entre 0 e 1 para cada eixo. Isso permite que a imagem seja exibida corretamente em cada face, sem distorções. Para padrões repetitivos, as UVs podem ser ajustadas para repetir a textura ao longo da superfície.
    - **Esferas achatadas (alvo, cabeça da raquete):** O mapeamento UV utiliza a parametrização esférica, onde U representa a longitude e V a latitude. Mesmo quando a esfera é achatada (comprimida em um eixo), as coordenadas UV continuam baseadas na esfera original, garantindo que a textura cubra toda a superfície de forma proporcional. Isso é ideal para aplicar texturas circulares ou detalhes centrais, como logos ou padrões.
    - Em ambos os casos, a matriz de mapeamento UV é definida na geração dos vértices, associando a cada vértice um par (u, v) que indica qual ponto da textura será aplicado ali. O ajuste correto dessas coordenadas é essencial para evitar distorções e garantir realismo visual.

Essas etapas foram integradas de forma incremental, com testes e ajustes em cada fase para garantir interatividade fluida, visual agradável e funcionamento robusto do sistema.

---

## Atividades realizadas por cada membro
- **Renan Ryu Kajihara:**
  - Modelagem dos objetos 3D (boneco, raquete, bola, alvo, tijolos, chão)
  - Implementação da lógica de colisão e animação
  - Sistema de texturização multiobjeto
  - Iluminação, sombras e efeitos visuais
  - Manual do usuário e documentação

---

## Bugs e problemas conhecidos
- Em alguns navegadores, o carregamento de texturas pode falhar por restrições de CORS.
- O mapeamento UV do chão pode distorcer dependendo da escala.
- Pequenas imprecisões na detecção de colisão em ângulos extremos.
- O sistema não possui suporte para dispositivos móveis.
- Em situações com muitos objetos complexos sendo renderizados, a detecção de colisão com a raquete pode apresentar atrasos ou parecer menos responsiva, devido à sobrecarga de processamento.

---

**MAC0420/MAC5744 - Computação Gráfica - 2025**
