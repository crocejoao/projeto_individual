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

-- Para testar o login sem passar pelo cadastro (opcional):
-- INSERT INTO usuario (nome, email, senha, fk_personagem) VALUES ('Teste', 'teste@teste.com', 'Teste@123', 1);
