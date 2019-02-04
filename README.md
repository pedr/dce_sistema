
Sistema para o DCE desenvolvido por João, Marcelo e eu

Para se connectar a database é usado .env file no Linux, precisamos descobrir como que faz no Windows!

## PEDIDOS
  /api/pedidos

  GET '/'
    pega todos os pedidos com pedidosativos = true;

  GET '/:id'
    pega o pedido tal q pedidoid = id

  GET '/notActive'
    pega todos os pedidos que pedidosativos = false;

  GET '/search'
    aceita os parametros name, initialDate, finalDate e format
    TODOS SÃO OPCIONAIS
    name
      procura por nome em gerente LOGIN e pessoa NOME
    initialDate
      aceita data em formato YYYY-MM-DD, tras todos pedidos da data especificada em diante 
    finalDate
      mesmo formato do initialDate, se não é especificado valor padrão é o dia atual
    format
      se não é especificado devolve pedidos completos como no get '/'
      se format=sum, retorna um objeto com
	copiasCorretasTotais
	copiasErradasTotais
	totalDePedidos

  POST '/'
    adiciona pedido a lista CAMPOS alunoId, pedidoAtivo, copiaErrada, copiaCorreta, data, hora
    alunoId => não é mais usado
    pedidoAtivo => padrão é true
    copiaErrada => inteiro >= 0 OBRIGATORIO
    copiaCorreta => inteiro >= 0 OBRIGATORIO
    data => formato 2000-01-31
    hora => formato 14:30:00

  PATCH '/:id'
    muda o valor de pedidoativo de true pra false ou de false pra true
    id deve ser o pedidoId 

## REGISTRAR
  /registrar

  POST '/'
    requer nome, email, login, senha, confirmarSenha
      nome min 4 chars, maximo 50
      email
      login minimo 3 max 20
      senha minimo 6 max 20
      confirmarSenha tem que ser igual a senha
    Não obrigatório superUser 
      superUser BOOLEAN

## REGISTROS
  /api/registros

  guarda a hora que os admins logaram
    
    GET '/'
      pega todos os registros
    GET '/:id'
      pega um registro tal q registroid = id

