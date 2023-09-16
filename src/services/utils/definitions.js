// Objetivo: armazenar textos da documentação do Arara

export const objetivo =
    '## 🦜 Objetivo do Arara 🦜\n' +
    '* ➡️ Utilizar uma linguagem de programação prórpia e **totalmente em português**.\n' +
    '* ➡️ Ajudar no ensino de **programação para iniciantes**.\n' +
    '* ➡️ **Diminuir a estranheza** no primeiro contato com a programação.\n' +
    '* ➡️ **Linguagem simples**, intuitiva, baixa curva de aprendizado e de fácil manutenção.\n' +
    '* ➡️ **Plataforma online**, totalmente gratuita e de código aberto.\n' +
    '* ➡️ Oferecer uma plataforma de ensino de programação **focada no público brasileiro**.\n' +
    '* ➡️ Possibidade de melhorias e **contribuições por parte da comunidade**.\n' +
    '* ➡️ **Corretor automático** de atividades.\n';

export const funcionalidades =
    '## 🦜 Funcionalidades 🦜\n' +
    '* **💡Modo livre:** Permite escrever e executar códigos livremente.\n' +
    '* **📝Modo atividade:** Área para acessar atividade cadastrada pelo professor mediante um link\n' +
    '* **🧑‍💻Cadastrar atividade:** Área para professores cadastrarem atividades para os alunos.\n' +
    '* **📚Minhas atividades:** Área para alunos acessarem as já realizadas por eles.\n' +
    '* **📖Detalhes:** Área para professores acessarem as visualizações as submissões de cada atividade.\n';

export const defaultCode =
    '#INICIO_PROGRAMA;' +
    '\n\n//Escreva seu programa aqui!' +
    '\n\n#FIM_PROGRAMA;';

export const comandosIO =
    '## 🦜 Comandos de entrada e saída 🦜\n' +
    '* ➡️ **escreva:** Imprime um valor na tela.\n' +
    '   * ➡️ **Sintaxe:** escreva(<valor>);\n' +
    '   * ➡️ **Valor:** Pode ser um texto ou uma variável.\n' +
    '* ➡️ **leia:** Lê um valor digitado pelo usuário e armazena em uma variável.\n' +
    '   * ➡️ **Sintaxe:** leia(<variável>);\n' +
    '* ➡️ **declaração de variáveis:** Deve-se utilizar da seguinte forma: ;\n' +
    '   * ➡️ **Tipos disponíveis:** inteiro, real, texto, caractere e lógico.\n';

export const helloWorld =
    '// É possível comentar o código utilizando \'//\' no início do comentário\n' +
    '// Comentários são desconsiderados durante a compilação\n\n' +
    '// Todo o código deve estar entre #INICIO_PROGRAMA e #FIM_PROGRAMA\n' +
    '#INICIO_PROGRAMA;' +
    '\n\n// Escreva(\'\') é utilizado para imprimir na tela' +
    '\n// O texto deve estar entre aspas simples' +
    "\nescreva('Olá, mundo!');" +
    '\n\n// Delimita o fim do programa' +
    '\n#FIM_PROGRAMA;\n';

export const entradaDados  =
    '#INICIO_PROGRAMA;' +
    '\n\n // Declaração de variáveis' +
    '\n// Deve-se utilizar da seguinte forma: <tipo> <nome_variavel>;' +
    '\n// Os tipos disponíveis são: inteiro, real, texto, caractere e lógico' +
    '\n// Os nomes de variáveis devem ser válidos' +
    '\n// Letras(minúsculas e maiúsculas), números e underscore são permitidos' +
    '\n// Não pode conter espaços, acentos, caracteres especiais e começar com números' +
    '\ninteiro numero;' +
    '\n\nescreva(\'Digite um número: \');' +
    '\n\n// Leitura de dados' +
    '\n// Deve-se utilizar da seguinte forma: leia(<nome_variavel>);' +
    '\n// O valor digitado será armazenado na variável entre parênteses' +
    '\nleia(numero);' +
    '\n\n// Para imprimir o valor de uma variável, basta escrever o nome dela' +
    '\n// Pode-se utilizar de duas formas: ' +
    '\n// escreva(<nome_variavel>); ou escreva(\'<texto>\', <nome_variavel>);' +
    '\nescreva(\'O número digitado foi: \', numero);' +
    '\n\n#FIM_PROGRAMA;\n';

export const tiposDados =
    '#INICIO_PROGRAMA;' +
    '\n\n// No Arara, as variáveis podem ser inicializadas ou não' +
    '\n// As variáveis podem ser declaradas em qualquer parte do código' +
    '\n// As variáveis devem ser declaradas apenas uma vez' +
    '\n// As variáveis podem ser declaradas e inicializadas na mesma linha utilizando =' +
    '\n// Não é necessário atribuir um valor na declaração' +
    '\n// Deve-se atribuir um valor compatível com o tipo da variável' +
    "\ninteiro numero_inteiro = 10;" +
    "\n\n// número real sempre deve ser declarado com um . seguido de um algarismo" +
    "\nreal numero_real = 10.5;" +
    "\n\n// para atribuir o tipo texto deve-se usar aspas simples" +
    "\ntexto txt = 'Texto de teste'" +
    "\n\n// o tipo caractere funciona como o tipo texto com a limitação de apenas uma entrada" +
    "\ncaractere char = 'A';" +
    "\n\n// o tipo lógico pode assumir apenas os valores verdadeiro ou falso" +
    "\nlogico lgc = verdadeiro;" +
    '\n\n#FIM_PROGRAMA;\n';

export const comandosAritmeticos =
    '## 🦜 Comandos aritméticos 🦜\n' +
    '* ➡️ **Operadores:** + - * /\n' +
    '   * ➡️ **Operações:** adição, subtração, multiplicação e divisão\n' +
    '   * ➡️ **Sintaxe:** <variável> = <variável> <operador> <variável>;\n' +
    '   * ➡️ **Exemplo:** numero = 10 + 5;\n' +
    '   * ➡️ **Observação:** O operador de divisão sempre retorna um valor real, será feito um truncamento caso necessário.\n';


export const soma =
    '#INICIO_PROGRAMA;' +
    '\n\n// Inicializando x com o valor 10 e y com o valor 5' +
    '\ninteiro x = 10;' +
    '\ninteiro y = 5;' +
    '\n\n// Declarando a variável resultado - sem valor inicial' +
    '\ninteiro resultado;' +
    '\n\n// O operador + é utilizado para realizar uma soma entre dois operandos' +
    '\n// Os operandos podem ser variáveis ou valores literais' +
    '\n// O resultado da soma é armazenado na variável resultado' +
    '\nresultado = x + y;' +
    '\n\nescreva(\'O resultado da soma é: \', resultado);' +
    '\n\n#FIM_PROGRAMA;\n';

export const subtracao =
    '#INICIO_PROGRAMA;' +
    '\n// É possível utilizar fazer cálculos com valores inteiro e reais' +
    '\n\nreal x = 1.5;' +
    '\nreal y = 1.5;' +
    '\n\n// O resultado da subtração entre dois valores reais é um valor real' +
    '\n// Caso a variavel resultado seja do tipo inteiro, o valor será truncado' +
    '\nreal resultado;' +
    '\n\n// O operador - é utilizado para realizar uma subtração entre dois operandos' +
    '\nresultado = x - y;' +
    '\n\nescreva(\'O resultado da subtração é: \', resultado);' +
    '\n\n#FIM_PROGRAMA;\n';

export const multiplicacao =
    '#INICIO_PROGRAMA;' +
    '\n\ninteiro a = 10;' +
    '\nreal b = 2.5;' +
    '\n\n// A operação gerará um valor real' +
    '\n// Como a variável resultado é do tipo inteiro, o valor será truncado' +
    '\ninteiro resultado;' +
    '\n\n// O operador * é utilizado para realizar uma multiplicação entre dois operandos' +
    '\nresultado = a * b;' +
    '\n\nescreva(\'O resultado da multiplicação é: \', resultado);' +
    '\n\n#FIM_PROGRAMA;\n';

export const divisao =
    '#INICIO_PROGRAMA;' +
    '\n\ninteiro a = 10;' +
    '\ninteiro b = 5;' +
    '\ninteiro resultado;' +
    '\n\n// O operador / é utilizado para realizar uma divisão entre dois operandos' +
    '\nresultado = a / b;' +
    '\n\nescreva(\'O resultado da divisão é: \', resultado);' +
    '\n\n#FIM_PROGRAMA;\n';

export const comandosCondicionais =
    '## 🦜 Comandos condicionais 🦜\n' +
    '* ➡️ **se:** Executa um bloco de código caso a condição seja verdadeira.\n' +
    '   * ➡️ **Sintaxe:** se(<condição>){ <bloco> }\n' +
    '* ➡️ **senao se:** Executa um bloco de código caso a condição imediamente superior seja falsa e a sua seja verdadeira.\n' +
    '   * ➡️ **Sintaxe:** senao se(<condição>){ <bloco> }\n' +
    '* ➡️ **senao:** Executa um bloco de código caso a condição imediatamente superior seja falsa.\n' +
    '   * ➡️ **Sintaxe:** senao{ <bloco> }\n' +
    '* ➡️ **Operadores lógicos:** < > <= >= == != || &&\n' +
    '   * ➡️ **Operações:** **menor que, maior que, menor ou igual que, maior ou igual que, igual, diferente, ou, e**\n' +
    '   * ➡️ **Sintaxe:** <variável/valor> <operador> <variável/valor>\n' +
    '   * ➡️ **Exemplo:** numero < 10\n';

export const condicionalSe =
    '#INICIO_PROGRAMA;' +
    '\n\n// Declaração e leitura da variável num' +
    '\ninteiro num;' +
    "\nescreva('Digite a sua idade: ');" +
    '\nleia(num);' +
    '\n\n// Entrará no bloco caso a condição/variável entre parênteses seja verdadeira' +
    '\n// O bloco deve estar entre chaves' +
    '\n// Pode-se utilizar uma condição ou uma variável do tipo lógico' +
    '\n// As condições possíveis são: <, >, <=, >=, ==, !=, ||, &&' +
    '\n// < é utilizado para verificar se o valor da esquerda é menor que o da direita' +
    '\n// > é utilizado para verificar se o valor da esquerda é maior que o da direita' +
    '\n// <= é utilizado para verificar se o valor da esquerda é menor ou igual ao da direita' +
    '\n// >= é utilizado para verificar se o valor da esquerda é maior ou igual ao da direita' +
    '\n// == é utilizado para verificar se dois valores são iguais' +
    '\n// != é utilizado para verificar se dois valores são diferentes' +
    '\n// || é utilizado para verificar se uma das condições é verdadeira' +
    '\n// && é utilizado para verificar se as duas condições são verdadeiras' +
    '\nse(num < 50){' +
    '\n\t// O bloco pode conter qualquer instrução' +
    "\n\tescreva('Você ainda está na flor da idade!');" +
    '\n}' +
    '\n\n// Pode-se utilizar o senão para executar um bloco ' +
    '\n// caso a condição imediatamente superior seja falsa' +
    '\n// Não é obrigatório utilizar o senão' +
    '\n// O comando senão não possui condição' +
    '\nsenao{' +
    "\n\tescreva('Melhor ficar esperto!');" +
    '\n}' +
    '\n\n#FIM_PROGRAMA;\n';

export const condicionalSenaoSe =
    '#INICIO_PROGRAMA;' +
    '\n\ninteiro num;' +
    "\nescreva('Digite a sua idade: ');" +
    '\nleia(num);' +
    '\n\n// É possível encadear várias condições utilizando o senao se' +
    '\n// O encadeamento é mutuamente exclusivo - apenas um bloco será executado' +
    '\n// Deve-se sempre iniciar com o se, seguido de quantos senao se forem necessários' +
    '\n// O último bloco pode ser um senao ou um senao se' +
    '\nse(num < 18){ // caso num seja menor que 18' +
    "\n\tescreva('Você ainda está na flor da idade!');" +
    '\n}senao se(num < 40){ // caso num seja maior ou igual a 18 e menor que 40' +
    "\n\tescreva('Você ainda tem muito o que viver!');" +
    '\n}senao se(num < 70){ // caso num seja maior ou igual a 40 e menor que 70' +
    "\n\tescreva('Hora de curtir aposentadoria!');" +
    '\n}senao se(num < 100){ // caso num seja maior ou igual a 70 e menor que 100' +
    "\n\tescreva('Nessa idade e ainda quer aprender a programar???');" +
    '\n}' +
    '\n\n#FIM_PROGRAMA;';

export const condicionalOperadoresLogicos =
    '#INICIO_PROGRAMA;' +
    '\n\n// Variáveis do tipo lógico podem assumir apenas os valores verdadeiro ou falso' +
    '\nlogico var1 = verdadeiro;' +
    '\nlogico var2 = falso;' +
    '\n\n// Entrará no bloco caso uma das condições seja verdadeira' +
    '\nse(var1 || var2){' +
    "\n\tescreva('Operador ou');" +
    '\n}' +
    '\n\n// Entrará no bloco caso as duas condições sejam verdadeiras' +
    '\nse(var1 && var2){' +
    "\n\tescreva('Operador e');" +
    '\n}' +
    '\n\n#FIM_PROGRAMA;';

export const comandosRepeticao =
    '## 🦜 Comandos de repetição 🦜\n' +
    '* ➡️ **enquanto:** Executa um bloco de código enquanto a condição for verdadeira.\n' +
    '   * ➡️ **Sintaxe:** enquanto(<condição>){ <bloco> }\n' +
    '* ➡️ **para:** Executa um bloco de código enquanto a condição for verdadeira.\n' +
    '   * ➡️ **Sintaxe:** para(<contador> = <valor_inicial>; <condição>; <incremento>){ <bloco> }\n';

export const whileLoop =
    '#INICIO_PROGRAMA;' +
    '\n\n// Para utilizar o laço de repetição enquanto, deve-se declarar uma variável inteira' +
    '\n// Esta variável será utilizada como contador' +
    '\ninteiro index = 0;' +
    '\n\n// O laço será executado enquanto a condição for verdadeira' +
    '\n// A condição pode utlizar qualquer operador de comparação citado anteriormente' +
    '\nenquanto(index <= 10){' +
    '\n\t// Este bloco será executado enquanto a condição for verdadeira - nessse caso, 11 vezes' +
    "\n\tescreva('valor: ', index);" +
    "\n\tescreva('\\n');" +
    '\n\t// O contador deve ser incrementado para que a condição seja falsa em algum momento' +
    '\n\t// Caso contrário, o laço será executado infinitamente - loop infinito' +
    '\n\tindex++;' +
    '\n}' +
    '\n\n#FIM_PROGRAMA;';

export const forLoop =
    '#INICIO_PROGRAMA;' +
    '\n\n// É preciso três parâmetros para utilizar o laço de repetição para' +
    '\n// O primeiro parâmetro é o contador (ele pode ser declarado ou apenas ter o seu valor definido (i = 0))' +
    '\n// O segundo parâmetro é a condição de parada (o laço será executado enquanto a condição for verdadeira)' +
    '\n// O terceiro parâmetro é o incremento do contador (o contador será incrementado/decrementado a cada iteração)' +
    '\npara(inteiro i = 0; i < 10; i++){' +
    '\n\t// Este bloco será executado enquanto a condição for verdadeira - nesse caso, 10 vezes' +
    "\n\tescreva('Valor: ', i);" +
    "\n\tescreva('\\n');" +
    '\n}' +
    '\n\n#FIM_PROGRAMA;';

export const comandosVetor =
    '## 🦜 Comandos de vetor 🦜\n' +
    '* ➡️ **declaração:** Declara um vetor de um determinado tipo e tamanho.\n' +
    '   * ➡️ **Sintaxe:** <tipo> <nome_vetor>[<tamanho>];\n' +
    '* ➡️ **atribuição:** Atribui valores a um vetor.\n' +
    '   * ➡️ **Sintaxe:** <nome_vetor> = [<valor1>, <valor2>, ..., <valorN>];\n' +
    '* ➡️ **acesso:** Acessa um valor de um vetor.\n' +
    '   * ➡️ **Sintaxe:** <nome_vetor>[<índice>];\n' +
    '   * ➡️ **Observação:** Os índices começam em 0 e vão até o tamanho do vetor - 1.\n';

export const vetorDeclaracao =
    '#INICIO_PROGRAMA;' +
    '\n\n// Vetores são variáveis que armazenam mais de um valor' +
    '\n// Sintaxe para declaração de um vetor: <tipo> <nome_vetor>[<tamanho>];' +
    '\n// O tamanho deve ser um valor inteiro positivo' +
    '\ninteiro vetor[5];' +
    '\n\n// Para atribuir valores a um vetor, deve-se passar um vetor de mesmo tamanho depois do sinal de igual' +
    '\nvetor = [44, 55, 66, 77, 88];' +
    '\n\n// Para atrubuir um valor a uma posição específica do vetor, deve-se utilizar o índice da posição' +
    '\n// Os índices começam em 0 e vão até o tamanho do vetor - 1' +
    '\nvetor[2] = 100;' +
    '\nescreva(vetor);' +
    '\n\n#FIM_PROGRAMA;';

export const vetorAcesso =
    '#INICIO_PROGRAMA;' +
    '\n\n// É possível declarar e inicializar um vetor na mesma linha' +
    '\ninteiro vetor[2] = [50, 51];' +
    '\ninteiro resultado;' +
    '\n\n// Para acessar um valor de um vetor, deve-se utilizar o índice da posição' +
    '\n// É possível fazer operações aritméticas com os valores de um vetor' +
    '\nresultado = vetor[0] + vetor[1];' +
    '\nescreva(resultado);' +
    '\n\n#FIM_PROGRAMA;';