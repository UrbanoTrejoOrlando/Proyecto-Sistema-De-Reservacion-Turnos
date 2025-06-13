const { getUsers } = require("../services/authServices");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const login = async (req, res) => {
  const { correo, contrasenia } = req.body;

  try {
    const users = await getUsers();
    const user = users.find(u => u.correo === correo);

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const match = await bcrypt.compare(contrasenia, user.contrasenia);
    if (!match) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    const token = generateToken({ id: user._id, rol: user.rol });

    res.json({
      msg: "Login exitoso",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        apellido1: user.apellido1,
        apellido2: user.apellido2,
        correo: user.correo,
        rol: user.rol,
      }
      
    });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor", error: error.message });
  }
};

module.exports = { login };
