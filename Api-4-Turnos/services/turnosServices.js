// Exportacion del modelo de nuestra base de datos
const Turno = require("../model/turnosModel");
const axios = require("axios");
require("dotenv").config()

// Importacion de urls
const API1 = process.env.API1USERS;
const API3 = process.env.API3SERVICES;

// Funcion para crear un turno
const CreateTurno = async (data) => {
    try {
      // Verificar existencia del servicio
      const service = await axios.get(`${API3}/${data.serviceId}`);
  
      // Verificar existencia del usuario
      const user = await axios.get(`${API1}/${data.userId}`);
  
      if (!service.data || !user.data) throw new Error("Usuario o servicio no encontrado");
  
      const newTurno = new Turno(data);
      await newTurno.save();
      return newTurno;
    } catch (error) {
      throw new Error("Error al crear el turno: " + error.message);
    }
  };
  
// Funcion para obtener todos los turnos  
const GetAllTurnos = async () => {
  try {
    return await Turno.find();
  } catch (error) {
    throw new Error("Error al obtener los turnos: " + error.message);
  }
};

// Funcion para obtener un turno por su id
const GetTurnoById = async (turnoId) => {
  try {
    const turno = await Turno.findById(turnoId);
    if (!turno) throw new Error("El turno no existe");
    return turno;
  } catch (error) {
    throw new Error("Error al obtener el turno: " + error.message);
  }
};

// Funcion para actualizar un turno
const UpdateTurno = async (turnoId, data) => {
  try {
    const turnoActualizado = await Turno.findByIdAndUpdate(turnoId, data, { new: true });
    if (!turnoActualizado) throw new Error("El turno no existe");
    return turnoActualizado;
  } catch (error) {
    throw new Error("Error al actualizar el turno: " + error.message);
  }
};

// Funcion para eliminar un turno
const DeleteTurno = async (turnoId) => {
  try {
    const eliminado = await Turno.findByIdAndDelete(turnoId);
    if (!eliminado) throw new Error("El turno no existe");
    return eliminado;
  } catch (error) {
    throw new Error("Error al eliminar el turno: " + error.message);
  }
};

module.exports={CreateTurno, GetAllTurnos, GetTurnoById, UpdateTurno, DeleteTurno};

