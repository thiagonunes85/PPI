const express = require('express');
const path = require('path');
const mysql = require('mysql2')
const cors = require('cors');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '6yyTNC@90',
  database: 'poo'
})

connection.connect()
connection.query('SELECT CURRENT_TIMESTAMP()', (err, rows, fields) => {
  if (err) throw err
  console.log('The solution is: ', rows[0].solution)
})
//connection.end()

// criando o objeto express
const app = express();
app.use(cors());
app.use(express.json()); // Adicione esta linha para analisar os dados JSON no corpo da solicitação
app.use("/",express.static(path.join(__dirname,'client')))

// rota get
app.get("/api",(req, res)=>{
  //res.send("<h1>Hello World from GET</h1>");
  //res.set("Content-Type","text/plain");
  res.type("json");
  res.send('{"msg":"Hello World from GET"}');
})
//

// ========================================================= SISTEMA =================================================== // 

// create (POST) para a tabela sistema
app.post('/sistema', (req, res) => {
  const { no_sistema, nu_versao, de_versao, dh_versao } = req.body;
  const query = 'INSERT INTO tb00_sistema (no_sistema, nu_versao, de_versao, dh_versao) VALUES (?, ?, ?, ?)';
  connection.query(query, [no_sistema, nu_versao, de_versao, dh_versao], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    } else {
      res.status(201).json({ message: 'Registro criado com sucesso!' });
    }
  });
});

// read (GET) para a tabela sistema (FEITO EM SALA)
app.get('/sistema',  (req, res)=> {
    connection.connect()
    connection.query('SELECT * FROM tb00_sistema', function (err, rows,fields)
    {
    if (err) throw err;
            if (!err && rows.length > 0) {
                res.json(rows);
            } else {
                res.json([]);
            }
  });
  //connection.end()
});

// read (GET) para um id especifico da tabela sistema
app.get('/sistema/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM tb00_sistema WHERE id_sistema = ?', id, (err, rows) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    } else if (rows.length === 0) {
      res.status(404).json({ error: 'Registro não encontrado' });
    } else {
      res.json(rows[0]);
    }
  });
});

// update (PUT) para um id especifico da tabela sistema
app.put('/sistema/:id', (req, res) => {
  const id = req.params.id;
  const dadosAtualizados = req.body;

  connection.query('UPDATE tb00_sistema SET ? WHERE id_sistema = ?', [dadosAtualizados, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar o registro:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Registro não encontrado' });
    } else {
      res.json({ message: 'Registro atualizado com sucesso' });
    }
  });
});

// delete (DELETE) um id especifico da tabela sistema
app.delete('/sistema/:id', (req, res) => {
  const id = req.params.id;

  connection.query('DELETE FROM tb00_sistema WHERE id_sistema = ?', id, (err, result) => {
    if (err) {
      console.error('Erro ao excluir o registro: ',id, 'da tabela sistema.', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Registro não encontrado' });
    } else {
      res.json({ message: 'Registro excluído com sucesso!' });
    }
  });
});

// ========================================================================================================================= // 

//

// ========================================================= DISPOSITIVO =================================================== // 

// create (POST) para a tabela dispositivo
app.post('/dispositivo', (req, res) => {
  const { no_mc, dh_inclusao } = req.body; 

  connection.query(
    'INSERT INTO tb01_dispositivo (no_mc, dh_inclusao) VALUES (?, ?)',
    [no_mc, dh_inclusao],
    function (err, result) {
      if (err) throw err;

      res.json({ id: result.insertId });
    }
  );
});


// read (GET) para a tabela dispositivo
app.get('/dispositivo', (req, res) => {
  connection.query('SELECT * FROM tb01_dispositivo', function (err, rows) {
    if (err) throw err;

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.json([]);
    }
  });
});

// read (GET) para um id especifico na tabela dispositivo
app.get('/dispositivo/:id', (req, res) => {
  const id = req.params.id;

  connection.query(
    'SELECT * FROM tb01_dispositivo WHERE id_mc = ?',
    [id],
    function (err, rows) {
      if (err) throw err;

      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ message: 'Registro não encontrado' });
      }
    }
  );
});

// update (PUT) para a tabela dispositivo
app.put('/dispositivo/:id', (req, res) => {
  const id = req.params.id;
  const { no_mc, dh_inclusao } = req.body; 

  connection.query(
    'UPDATE tb01_dispositivo SET no_mc = ?, dh_inclusao = ? WHERE id_mc = ?',
    [no_mc, dh_inclusao, id],
    function (err, result) {
      if (err) throw err;

      if (result.affectedRows > 0) {
        res.json({ message: 'Registro atualizado com sucesso' });
      } else {
        res.status(404).json({ message: 'Registro não encontrado' });
      }
    }
  );
});

// delete (DELETE) para a tabela dispositivo
app.delete('/dispositivo/:id', (req, res) => {
  const id = req.params.id;

  connection.query(
    'DELETE FROM tb01_dispositivo WHERE id_mc = ?',
    [id],
    function (err, result) {
      if (err) throw err;

      if (result.affectedRows > 0) {
        res.json({ message: 'Registro excluído com sucesso' });
      } else {
        res.status(404).json({ message: 'Registro não encontrado' });
      }
    }
  );
});

// ========================================================================================================================= // 

//

// ========================================================= TEMPERATURA =================================================== // 

// create (POST) para a tabela temperatura
app.post('/temperatura', (req, res) => {
  const { id_mc, dh_inclusao, dh_amostra, nu_temp, sg_escala } = req.body;

  connection.query(
    'INSERT INTO tb02_temperatura (id_mc, dh_inclusao, dh_amostra, nu_temp, sg_escala) VALUES (?, ?, ?, ?, ?)',
    [id_mc, dh_inclusao, dh_amostra, nu_temp, sg_escala],
    function (err, result) {
      if (err) throw err;

      res.json({ id: result.insertId });
    }
  );
});

// read (GET) para a tabela temperatura
app.get('/temperatura', (req, res) => {
  connection.query('SELECT * FROM tb02_temperatura', function (err, rows) {
    if (err) throw err;

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.json([]);
    }
  });
});

// read (GET) para um id especifico na tabela temperatura
app.get('/temperatura/:id', (req, res) => {
  const id = req.params.id;

  connection.query(
    'SELECT * FROM tb02_temperatura WHERE id_temp = ?',
    [id],
    function (err, rows) {
      if (err) throw err;

      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ message: 'Registro não encontrado' });
      }
    }
  );
});

// update (UPDATE) para a tabela temperatura
app.put('/temperatura/:id', (req, res) => {
  const id = req.params.id;
  const { id_mc, dh_inclusao, dh_amostra, nu_temp, sg_escala } = req.body; // Obtém os dados do corpo da requisição

  connection.query(
    'UPDATE tb02_temperatura SET id_mc = ?, dh_inclusao = ?, dh_amostra = ?, nu_temp = ?, sg_escala = ? WHERE id_temp = ?',
    [id_mc, dh_inclusao, dh_amostra, nu_temp, sg_escala, id],
    function (err, result) {
      if (err) throw err;

      if (result.affectedRows > 0) {
        res.json({ message: 'Registro atualizado com sucesso' });
      } else {
        res.status(404).json({ message: 'Registro não encontrado' });
      }
    }
  );
});

// delete (DELETE) para a tabela temperatura
app.delete('/temperatura/:id', (req, res) => {
  const id = req.params.id;

  connection.query(
    'DELETE FROM tb02_temperatura WHERE id_temp = ?',
    [id],
    function (err, result) {
      if (err) throw err;

      if (result.affectedRows > 0) {
        res.json({ message: 'Registro excluído com sucesso' });
      } else {
        res.status(404).json({ message: 'Registro não encontrado' });
      }
    }
  );
});

// ========================================================================================================================= // 


const PORT = 5000;
// 

app.listen(PORT, ()=>{
  console.log(`Server rodando na porta ${PORT}`);
});