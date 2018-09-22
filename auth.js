const express = require('express');
const app = express();
const request = require('request');
const sqlServer = require('mssql');
const connStr = process.env.DATABASE_URL || "Server=host;Database=banco;User Id=test;Password=password;";
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/auth', express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
var arrayTela = [];''
const auth = 'auth'

router.post('/auth', (req, res) => {		
	execSQLQuery(`Select * from pub.versao where versao = '${req.body.quarto}'`, res);	
})	

router.get('/auth', (req, res) => {
    res.render(auth,{erro:{}});
})

function execSQLQuery(sqlQry,res){	
    	global.conn.request().query(sqlQry)
               .then(result => {		
				  if(result.recordset.length){
					redirect(res);
				  }else{
					validate(res)
				  }								
               }).catch(err => res.json(err));
}

function validate(res){
	var erro = {msg:"Paciente não localizado."}
	res.format({
		html: function(){
			res.status(400).render(auth,{erro:erro});
		},
		json: function(){
			res.status(400).send(erro);
		}
	});
	return ;
}

function redirect(res){
	res.writeHead(301,
		{Location: 'http://ww.google.com'}
	  );
	  res.end();
}

sqlServer.connect(connStr)
   .then(conn => {
        global.conn = conn;
        app.listen(port);
        console.log('Servidor rodando...');
   })
   .catch(err => console.log(err));

app.use('/', router);
