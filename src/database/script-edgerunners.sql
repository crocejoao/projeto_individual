CREATE DATABASE cyberpunk_edgerunners;

USE cyberpunk_edgerunners;

CREATE TABLE personagem (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50),
	frase VARCHAR(150),      -- frase do personagem (você escolhe e escreve)
	descricao VARCHAR(300),  -- características dele, em texto corrido
	classe VARCHAR(30)       -- papel na equipe
);



-- A ORDEM continua importando: ids 1 a 4 precisam bater com os value das <option> do cadastro.html
INSERT INTO personagem (nome, frase, descricao, classe) VALUES

	('David Martinez', 'Escreva aqui a frase do David', 'Garoto de rua que entra para a equipe de Maine.', 'Mercenário'),

	('Lucy', 'Escreva aqui a frase da Lucy', 'Netrunner misteriosa que sonha em chegar à Lua.', 'Netrunner'),

	('Maine', 'Escreva aqui a frase do Maine', 'Líder da equipe, protege quem está sob seu comando.', 'Nômade'),

	('Rebecca', 'Escreva aqui a frase da Rebecca', 'Atiradora explosiva da equipe de Maine.', 'Nômade');



CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50),
	email VARCHAR(50) UNIQUE, -- UNIQUE = o banco não deixa cadastrar o mesmo e-mail duas vezes
	senha VARCHAR(50),
	fk_personagem INT,
	FOREIGN KEY (fk_personagem) REFERENCES personagem(id)
);

-- As tabelas do questionário (perguntas/respostas) ficam para a próxima etapa.

CREATE TABLE resultado_questionario (
	id INT PRIMARY KEY AUTO_INCREMENT,
	fk_usuario INT NOT NULL,
	resposta1 VARCHAR(30),
	resposta2 VARCHAR(30),
	resposta3 VARCHAR(30),
	resposta4 VARCHAR(30),
	resposta5 VARCHAR(30),
	resposta6 VARCHAR(30),
	resposta7 VARCHAR(30),
	resposta8 VARCHAR(30),
	pontos_netrunner INT,
	pontos_mercenario INT,
	pontos_nomade INT,
	pct_netrunner DECIMAL(4,1),
	pct_mercenario DECIMAL(4,1),
	pct_nomade DECIMAL(4,1),
	classe_predominante VARCHAR(50),
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	UNIQUE KEY uq_resultado_usuario (fk_usuario),
	FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);

-- Para testar o login sem passar pelo cadastro (opcional):
-- INSERT INTO usuario (nome, email, senha, fk_personagem) VALUES ('Teste', 'teste@teste.com', 'Teste@123', 1);
