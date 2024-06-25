// Importación de la librería Express para la creación de la aplicación web
const express = require('express');

// Importación de la librería Path para manipulación de rutas de archivos y directorios
const path = require('path');

// Importación de la librería MySQL para la conexión y manipulación de la base de datos
const mysql = require('mysql');

//21-06-24
//Importamos la libreria multer
const multer = require('multer'); 

// Creación de la aplicación Express
const app = express();

// Puerto en el que se ejecutará el servidor
const port = 3000; 

//21-06-24
//Configuro la libreria multer para el manejo de archivos
const upload = multer({dest: 'imagenes/'});

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '*Marco18',
    database: 'appbd'
});

// Conexión a la base de datos y manejo de errores
connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});
/////////////////////////////IMAGENES///////////////////////////////////////////////
//Middlware para rescatar los datos 21-06-24 para las imagenes
// Middleware para el análisis de datos de formularios codificados en URL
app.use(express.urlencoded({ extended: true }));
//Servidor estático para cargar la imagen, se hace parte del servidor
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));
//
//
//
//Peticion para subir las imagenes a la BDD
app.post('/subir_imagenes', upload.single('imagen'), (req, res) =>{
        //Extraigo los datos de la url
        const {nombre, descripcion} = req.body;
        //Extraigo la imagen
        const imagen = req.file.filename;
        //Defino la consulta SQL para insertar la imagen
        const sql ='INSERT INTO imagenes (nombre, descripcion, imagen) VALUES (?, ?, ?)';
        //Ejecuto la consulta SQL con los valores extraidos
    connection.query(sql, [nombre, descripcion, imagen], (err) =>{
            //Si hay error muestra una exepcion
            if(err) throw err;
            //Si la insercion es exitosa
            res.redirect('/')
        });
    });
//Peticion para obtener las imagenes
app.get('/imagenes', (req, res) => {
    const sql = 'SELECT nombre, descripcion, imagen FROM imagenes';
    connection.query(sql, (err, result) =>{
        if(err){
            console.error('Error al obtener los datos de la BDD' + err.stack);
            res.status(500).send('Error al obtener los datos de la BDD');
            return;
        }
        //Si los datos existen los convierto en formato JSON
        res.json(result);
    });
});
///////////////////////////////////////////////////////////////////
//
//
///
//

// Middleware para el análisis de datos JSON
app.use(express.json());

//Ruta para ejecutar el directorio en el servidor
app.use(express.static(path.join(__dirname, 'pagina_principal')));
//
//
///
//21-06-24
///////////////////////////////////////////REGISTRAR////////////////////////////////////////////////
// Ruta para manejar la solicitud de guardar un nuevo curso mediante POST
app.post('/guardar_curso',(req, res) => {
    // Extracción de los datos del cuerpo de la solicitud
    const { nombre, apellido, correo, direccion, cursos, clave, rol } = req.body;
    // Consulta SQL para insertar los datos del curso en la base de datos
    const sql = 'INSERT INTO Cursos (nombre, apellido, correo, direccion, cursos, clave, rol) VALUES (?, ?, ?, ?, ?, ?, ?)';
    // Ejecución de la consulta SQL
    connection.query(sql, [nombre, apellido, correo, direccion, cursos, clave, rol], (err, result) => {
        if (err) throw err;
        console.log('Curso inscrito correctamente.');
        res.redirect('/');
    });
});
////////////////////////////////////REVISAR/////////////////////////////////////////////
// Ruta para obtener la lista de cursos mediante GET
app.get('/cursos', (req, res) => {
    // Consulta SQL para seleccionar todos los cursos de la base de datos
    connection.query('SELECT * FROM Cursos', (err, rows) => {
        if (err) throw err;
        // Envío de la lista de cursos como respuesta (puede ser HTML o JSON)
        res.send(rows);
    });
});
/////////////////////////////////////////////////////////////////////////////////////////
////22-06-24
// Nueva ruta para mostrar todos los usuarios
app.get('/cursos', (req, res) => {
    const query = 'SELECT * FROM cursos';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los usuarios:', err);
            res.send('Error al obtener los usuarios');
        } else {
            res.json(results);
        }
    });
});
// Nueva ruta para obtener los detalles de un usuario
app.get('/cursos/:id', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM cursos WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al obtener los detalles del usuario:', err);
            res.status(500).send('Error al obtener los detalles del usuario');
        } else {
            res.json(result[0]);
        }
    });
});
/////////////////////////////////////////SÍ FUNCIONA ELIMINAR///////////////////////////////////////////////
// Nueva ruta para eliminar un usuario
app.delete('/eliminar_usuario/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM cursos WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el usuario:', err);
            res.status(500).send('Error al eliminar el usuario');
        } else {
            res.status(200).send('Usuario eliminado exitosamente');
        }
    });
});
//////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////?????////////////////////////////////////////////////
// Ruta para obtener los datos de un curso por su ID mediante GET
app.get('/cursos/:id', (req, res) => {
    // Extracción del ID del curso desde la URL
    const id = req.params.id;
    // Consulta SQL para obtener los datos del curso con el ID proporcionado
    connection.query('SELECT * FROM Cursos WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al obtener los datos del usuario:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Registro no encontrado');
            return;
        }
        // Envío de los datos del curso como respuesta en formato JSON
        res.json(result[0]);
    });
});
///////////////////////////////////////////////////////////////////////////////////////////
//22-06-24
//Ruta o peticion para iniciar sesion
app.post('/iniciar_sesion', (req, res) =>{
    const {correo, clave} = req.body;
    //Defino una consulta SQL para obtener el rol del usuario
    const sql = 'SELECT rol FROM cursos WHERE correo = ? AND clave = ?';
    //Ejecuto la consulta y paso los datos a la consulta
    connection.query(sql, [correo,clave], (err, result) =>{
        if(err){
            console.error('Error al iniciar sesion', err);
            res.send('Error al Iniciar Sesion');
        //Si existe por lo menus 1 resultado de la consulta SQL
        }else if(result.length > 0){
            const rol = result[0].rol;
            if(rol === 1){
                res.redirect('/listardatos.html');
            }else if(rol === 2){
                res.redirect('/cursos.html');
            }
        }else{
            res.send('Correo o Clave Incorrectos');
        }
    });
});
// Inicio del servidor en el puerto especificado
app.listen(port, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
