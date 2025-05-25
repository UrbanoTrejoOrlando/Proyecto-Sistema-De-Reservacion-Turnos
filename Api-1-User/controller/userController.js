// Obtener en una variable los servicios de la api
const userServices = require("../services/modelServices");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

// Funcion para crear un usuario
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


