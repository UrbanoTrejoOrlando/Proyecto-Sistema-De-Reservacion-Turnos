// Importacion de librerias
const axios  = require("axios");
require("dotenv").config()

const URL_API = process.env.URL_USERS;

// Funcion para obtener todos los usuarios desde la api externa
const getUsers = async ()=>{
    const usuarios = await axios.get(URL_API);
    return usuarios.data;
}
module.exports ={getUsers};