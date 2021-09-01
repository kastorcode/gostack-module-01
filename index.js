// Query params = ?nome=Matheus
// Route params = /users/1
// Request body = { title: "", message: "" }
// CRUD = Create, Read, Update, Delete

const express = require('express');

const server = express();

server.use(express.json());

server.use((req, res, next) => {
	console.time('Request');
	console.log(`Método: ${req.method}\nURL: ${req.url}`);

	next();

	console.timeEnd('Request');
});

const users = ['Matheus', 'Naruto', 'Sasuke'];

function checkIndex(req, res, next) {
	if (users[req.params.index]) {
		return next();
	}
	else {
		return res.status(400).send('Invalid index');
	}
}

function checkName(req, res, next) {
	if (req.body.name) {
		return next();
	}
	else {
		return res.status(400).send('Missing property "name"');
	}
}

server.get('/users', (req, res) => {
	return res.json(users);
});

server.get('/users/:index', checkIndex, (req, res) => {
	const { index } = req.params;
	const nome = req.query.nome ? req.query.nome : 'World';

	return res.json({
		title: `<h1>Hello ${nome}!</h1>`,
		message: `<h2>Buscando o usuário ${users[index]}</h2>`
	});
});

server.post('/users', checkName, (req, res) => {
	const { name } = req.body;
	users.push(name);

	return res.json(users);
});

server.put('/users/:index', checkIndex, checkName, (req, res) => {
	const { index } = req.params;
	const { name } = req.body;

	users[index] = name;

	return res.json(users);
});

server.delete('/users/:index', checkIndex, (req, res) => {
	const { index } = req.params;

	users.splice(index, 1);

	return res.send();
});

server.listen(3000);