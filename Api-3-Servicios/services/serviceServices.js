// Variable para definir el modelo de base de datos
const Citas = require("../model/serviceModel");

//Funcion para crear un contacto
const CreateCita = async (data)=>{
    try{
        // Creacion de un usuario
        const newCita = new Citas(data);
        // Guardar el regsitro en la base de datos
        await newCita.save()
        // Retornar el nuevo usuario
        return newCita;

    }catch(error){  
        // Mensaje de errro si algo falla
        throw new Error("Error al crear el usuario" + error.message);

    }
};