// Funcion que representa un middleware
const logger = (req, res, next)=>{
    // Obtiene la fecha en tiempo real
    const fecha = new Date().toDateString();
    // Obtencion de todas las peticiones 
    const method = req.method;
    const url = req.originalUrl;

console.log(`[${fecha}]${method} ${url}`);
next();
}

module.exports = logger