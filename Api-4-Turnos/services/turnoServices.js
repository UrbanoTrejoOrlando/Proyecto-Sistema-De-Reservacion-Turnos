const Turno = require("../model/turnoModel");
const axios = require("axios");
const { verificarToken } = require("../middleware/authMiddleware");

class TurnoService {
  constructor() {
    this.apiServicios = process.env.API3SERVICES || "http://localhost:3008/api-3-services/services";
    this.apiUsuarios = process.env.API1USERS || "http://localhost:3006/api-1-user/users";
  }

  async validarServicio(servicioId, token) {
    try {
      const response = await axios.get(`${this.apiServicios}/${servicioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error("Servicio no encontrado");
    }
  }

  async validarUsuario(usuarioId, token) {
    try {
      const response = await axios.get(`${this.apiUsuarios}/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data) {
        throw new Error("Usuario no encontrado: respuesta vacía");
      }
      return response.data;
    } catch (error) {
      console.error("Error al validar usuario:", {
        usuarioId,
        url: `${this.apiUsuarios}/${usuarioId}`,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(`Usuario no encontrado: ${error.message}`);
    }
  }

  async verificarDisponibilidad(servicioId, fecha, hora) {
    const turno = await Turno.findOne({
      servicio: servicioId,
      fecha: new Date(fecha),
      hora,
      estado: { $in: ["reservado", "disponible"] },
    });
    return !turno || turno.estado === "disponible";
  }

  async crearTurno(data, userId, token, io) {
    try {
      const { servicio, fecha, hora, notas } = data;

      // Validar datos de entrada
      if (!servicio || !fecha || !hora) {
        throw new Error("Faltan campos requeridos: servicio, fecha, hora");
      }

      // Validar servicio y usuario
      await this.validarServicio(servicio, token);
      await this.validarUsuario(userId, token);

      // Verificar disponibilidad
      if (!(await this.verificarDisponibilidad(servicio, fecha, hora))) {
        throw new Error("El turno ya está reservado");
      }

      const nuevoTurno = await Turno.create({
        servicio,
        usuario: userId,
        fecha: new Date(fecha),
        hora,
        estado: "reservado",
        notas,
        metadata: {
          creadoPor: userId,
          tokenUsed: token,
        },
      });

      // Emitir evento en tiempo real
      io.emit("turno:created", { ...nuevoTurno._doc, id: nuevoTurno._id });

      return nuevoTurno;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async cancelarTurno(turnoId, userId, token, io) {
    try {
      const turno = await Turno.findById(turnoId);
      if (!turno) throw new Error("Turno no encontrado");

      // Verificar si el usuario es el dueño del turno
      if (turno.usuario !== userId) {
        throw new Error("No autorizado para cancelar este turno");
      }

      const updatedTurno = await Turno.findByIdAndUpdate(
        turnoId,
        {
          estado: "cancelado",
          $set: {
            "metadata.ultimaModificacion": new Date(),
            "metadata.canceladoPor": userId,
          },
        },
        { new: true }
      );

      // Emitir evento en tiempo real
      io.emit("turno:updated", { ...updatedTurno._doc, id: updatedTurno._id });

      return updatedTurno;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async listarTurnos(filtros = {}, userId, token) {
    try {
      // Solo mostrar los turnos del usuario autenticado
      filtros.usuario = userId;

      const turnos = await Turno.find(filtros).sort({ fecha: 1, hora: 1 });

      // Enriquecer con datos de las APIs externas
      const enrichedTurnos = await Promise.all(
        turnos.map(async (turno) => {
          const [servicio, usuario] = await Promise.all([
            this.validarServicio(turno.servicio, token),
            this.validarUsuario(turno.usuario, token),
          ]);
          return {
            ...turno._doc,
            id: turno._id,
            servicio: { nombre: servicio.nombre, duracion: servicio.duracion },
            usuario: { nombre: usuario.nombre, email: usuario.email },
          };
        })
      );

      return enrichedTurnos;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async generarTurnosDisponibles(servicioId, fecha, token) {
    try {
      // Validar servicio
      await this.validarServicio(servicioId, token);

      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) throw new Error("Fecha inválida");

      const turnosExistentes = await Turno.find({
        servicio: servicioId,
        fecha: fechaObj,
        estado: "reservado",
      });

      const horariosDisponibles = [];
      for (let hora = 8; hora < 20; hora++) {
        for (let minuto = 0; minuto < 60; minuto += 30) {
          const horaStr = `${hora.toString().padStart(2, "0")}:${minuto
            .toString()
            .padStart(2, "0")}`;

          const existe = turnosExistentes.some((t) => t.hora === horaStr);
          if (!existe) {
            horariosDisponibles.push(horaStr);
          }
        }
      }

      return horariosDisponibles;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new TurnoService();