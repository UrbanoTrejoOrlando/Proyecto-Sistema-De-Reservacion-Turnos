// Variable para definir el modelo de base de datos
const Services = require("../model/serviceModel");

//Funcion para crear un servicio
const CreateService = async (data)=>{
    try{
        // Creacion de un usuario
        const newService = new Services(data);
        // Guardar el regsitro en la base de datos
        await newServices.save()
        // Retornar el nuevo usuario
        return newService;

    }catch(error){  
        // Mensaje de errro si algo falla
        throw new Error("Error al crear el servicio" + error.message);

    }
};

// Funcion para obtener un servicio
const GetAllServices = async() =>{
    try{
        // Obtener el servicio
        const services = await Services.find();
        // Retornar servicios
        return services;
    }catch(error){
        // Mensaje de error si algo falla
        throw new Error("Error al obtener los servicios" + error.message);
    }    
};

// Funcion para obtener un servicio por su Id
const GetServiceById = async(serviceid)=>{
    try {
        // Obtencion del servicio
        const service = await Usuarios.findById(userid);
        // Validar si el usuario existe 
        if(!user) throw new Error("El usuario no existe "+ error.message);
        // retorna el usuarios
        return user;

    } catch (error) {
        // Mensaje de errro si algo falla
        throw new Error("Error al obtener el usuario" + error.message);
    }
};
