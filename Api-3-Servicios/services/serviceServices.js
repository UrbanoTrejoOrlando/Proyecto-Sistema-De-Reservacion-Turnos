// Variable para definir el modelo de base de datos
const Citas = require("../model/serviceModel");

//Funcion para crear un contacto
const CreateService = async (data)=>{
    try{
        // Creacion de un usuario
        const newService = new Citas(data);
        // Guardar el regsitro en la base de datos
        await newServices.save()
        // Retornar el nuevo usuario
        return newService;

    }catch(error){  
        // Mensaje de errro si algo falla
        throw new Error("Error al crear el servicio" + error.message);

    }
};