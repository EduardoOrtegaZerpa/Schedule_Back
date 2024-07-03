const express = require('express');
const sequelize = require('./config/database'); // Ajustado para importar Sequelize
const apiRoutes = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3001;


const corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200
}

app.use(express.json());

app.use(cors(corsOptions));
app.use(cookieParser());
app.use((req, res, next) => {
    console.log(` -> [${new Date().toISOString()}]Method: ${req.method}, URL: ${req.url}`);
    next();
});

app.use('/api', apiRoutes);

sequelize.authenticate()
    .then(() => {
        console.log('Conectado a la base de datos con Sequelize');

        return sequelize.sync({force: true});
    })
    .then(() => {
        console.log('Modelos sincronizados con la base de datos');

        app.get('/', (req, res) => {
            res.send(`DB connection working on port ${port}!`);
        });

        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        });

    })
    .catch(err => console.error('Error al conectar o sincronizar con la base de datos con Sequelize:', err));



