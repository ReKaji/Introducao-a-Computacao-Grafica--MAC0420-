# EP3 - MAC0420 - Bolhas x Agulhas

## Introdução

O programa desenvolvido no EP3 de MAC0420 cria um jogo interativo, na qual há 2 elementos principais: 

- as bolhas, que são representadas por esferas com diferentes níveis de detalhe;
- um agulha, que possui sua movimentação controlada pelo usuário.  

O objetivo do jogador é estourar as bolhas com a agulha. Para fazer isso, o jogador pode movimentar a agulha por meio das teclas:

Teclas que controlam a rotação da agulha:

- w: faz a agulha se mover para cima;
- x: faz a agulha se mover para baixo;
- a: faz a agulha virar para a esquerda;
- d: faz a agulha virar para a direita;
- z: faz a agulha girar no sentido anti-horário;
- c: faz a agulha girar no sentido horário;
- s: zera todas as velocidades de rotação da agulha.

Teclas que controlam a translação da agulha (se a velocidade de translação for positiva a agulha se move para frente, já se a velocidade de translação da agulha for negativa a agulha se move para trás):

- j: decrementa a velocidade de translação da agulha.
- l: incrementa a velocidade de translação da agulha;
- k: zera a velocidade de translação da agulha.

Além disso, o jogo possui o um botão Executar/Pausar que executa/pausa a simulação e outro botão Passo que, quando o programa estiver pausado, permite que a simulação avance um passo de cada vez.

## Horas trabalhadas

Estimo que trabalhei por 2 horas semanais durante 3 semanas, totalizando 6 horas totais para a implementação do programa.

## Dificuldades

A maior dificuldade encontrada para a realização do exercício foi lidar com as colisões. Nesse sentido, foi difícil identificar quando ocorria uma colisão da agulha com alguma bolha. 

## Bugs

Pelos testes realizados, nenhum bug foi detectado e o programa funciona adequadamente para os testes realizados.

Toda a parte "obrigatória" do exercício foi realizada, entretanto, nenhuma funcionalidade adicional foi implementada.

## Opcionais

Nenhuma funcionalidade opcional foi implementada.