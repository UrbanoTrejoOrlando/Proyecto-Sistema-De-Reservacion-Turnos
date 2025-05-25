// Obtener en una variable los servicios de la api
const userServices = require("../services/modelServices");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

// Peticion para crear un usuario
const createUser = async (req, res) => {
    try {
        const userData = req.body;

        // Validar que venga la contraseña
        if (!userData.contrasenia) {
            return res.status(400).json({ error: "La contraseña es obligatoria" });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        userData.contrasenia = await bcrypt.hash(userData.contrasenia, salt);

        // Crear el usuario
        const newUser = await userServices.CreateUser(userData);

        const SECRET_KEY = process.env.JWT_SECRET ;

        // Crear el token JWT
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            SECRET_KEY,
            { expiresIn: "24h" }
        );

        // Respuesta
        res.status(201).json({
            message: "Usuario creado correctamente",
            user: newUser,
            token,
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Peticion para obtener todos los usuarios
const getAllUser = async (req,res)=>{
    try {
        // Obtener todos los usuarios
        const users = await userServices.GetAllUser();
        // Configuracion del json
        res.status(200).json(contacts);

    } catch (error) {
        // Mensaje de error por si algo falla
        res.status(400).json({
            error: ("Error fallo la conexion " + error.message),
        });   
    }    
};

// Peticion para obtener un usuario por el id
const getUserById = async(req,res)=>{
    const {userid} = req.params;
    try {
        // Obtener un usuario por el id
        const user = await userServices.GetUserById(userid);
        // Configuracion del json
        res.status(200).json(contact);
    } catch (error) {
        // Mensaje de error por si algo falla
        res.status(400).json({
            error: error.message,
        });   
    }
};
