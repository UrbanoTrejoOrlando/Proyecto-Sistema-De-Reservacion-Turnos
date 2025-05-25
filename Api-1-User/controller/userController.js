// Obtener en una variable los servicios de la api
const userServices = require("../services/modelServices");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Peticion para crear un nuevo usuario
const createContact = async (req, res) =>{
    try {
        // Guardar los datos del body en una variable
        const userData = req.body;
        // Crear al contacto
        const newUser = await contactServices.CreateContact(userData);
        // Configuracion del json
        res.status(201).json({
            message: "Contacto creado correctamente",
            user: newUser,
        });
    } catch (error) {
        // Mensaje de error por si algo falla
        res.status(400).json({
            error: error.message,
        });
    }
};