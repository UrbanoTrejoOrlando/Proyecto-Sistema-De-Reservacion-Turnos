// Definicion de las rutas de las Apis
const services =[
    {
        //Api 1
        name: "usuarios",
        url:  "http://localhost:3006",
        path: "/api-usuarios"
    },
    {
        // Api 2
        name: "auth",
        url:  "http://localhost:3007",
        path: "/api-login"

    }
]
 // Exportacion del modulo 
module.exports = {services};