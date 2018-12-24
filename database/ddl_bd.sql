@@ -1,47 +0,0 @@
CREATE TABLE pessoa(
  pessoa_id integer serial not null,
  nome varchar(30) not null,
  sexo varchar(1) not null,
  email varchar not null,
  primary key(pessoa_id)
);

create table telefone(
  telefone_id integer serial not null,
  pessoa_id integer not null,
  numero varchar(11) not null
  foreign key(pessoa_id) references pessoa(pessoa_id),
  primary key(pessoa_id,telefone_id)
);

create table turma(
  turma_id integer serial not null,
  nome varchar(6) unique not null,
  primary key(turma_id)
);

create table aluno(
  aluno_id integer not null,
  matricula varchar(10) unique not null,
  turma_id integer not null,
  foreign key(turma_id,aluno_id) references turma(turma_id),pessoa(pessoa_id)
  primary key(aluno_id)
);

create table gerente(
  gerente_id integer not null,
  login varchar not null,
  senha varchar not null,
  superUser boolean not null,
  foreign key(gerente_id) references pessoa(pessoa_id)
  primary key(gerente_id)
);

create table regES(
  regES_id integer serial not null,
  gerente_id integer not null,
  dataHoraEntrada timestamp not null,
  dataHoraSaida timestamp not null,
  foreign key(gerente_id) references gerente(gerente_id),
  primary key(regES_id)
);
