create table turma(
  turmaId  serial not null,
  nome varchar(6) unique not null,
  primary key(turmaId)
);

CREATE TABLE pessoa(
  pessoaId serial not null,
  nome varchar(30) not null,
  sexo varchar(1) not null,
  email varchar not null,
  primary key(pessoaId)
);

create table telefone(
  telefoneId  serial not null,
  pessoaId integer not null,
  numero varchar(11) not null,
  foreign key(pessoaId) references pessoa(pessoaId),
  primary key(pessoaId, telefoneId)
);

create table aluno(
  alunoId integer not null,
  matricula varchar(10) unique not null,
  turmaId integer not null,
  ativo boolean not null,
  foreign key(turmaId) references turma(turmaId),
  foreign key(alunoId) references pessoa(pessoaId),
  primary key(alunoId)
);

create table gerente(
  gerenteId integer not null,
  login varchar not null,
  senha varchar not null,
  superUser boolean not null,
  foreign key(gerenteId) references pessoa(pessoaId),
  primary key(gerenteId)
);

create table registro(
  registroId  serial not null,
  gerenteId integer not null,
  dataHoraEntrada timestamp not null,
  dataHoraSaida timestamp not null,
  foreign key(gerenteId) references gerente(gerenteId),
  primary key(registroId)
);

create table session(
  gerenteId integer references gerente(gerenteId),
  token varchar,
  tokenExpDate timestamp with time zone default (now() + '30 mins'),
  primary key (gerenteId)
);
