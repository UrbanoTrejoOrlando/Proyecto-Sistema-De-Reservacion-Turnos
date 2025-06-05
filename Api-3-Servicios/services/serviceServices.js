// Variable para definir el modelo de base de datos
const Services = require("../model/serviceModel");

//Funcion para crear un servicio
const CreateService = async (data)=>{
    try{
        // Creacion de un usuario
        const newService = new Services(data);
        // Guardar el regsitro en la base de datos
        await newService.save()
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
        const service = await Services.findById(serviceid);
        // Validar si el servicio existe 
        if(!service) throw new Error("El servicio no existe "+ error.message);
        // retorna el usuarios
        return service;

    } catch (error) {
        // Mensaje de errro si algo falla
        throw new Error("Error al obtener el servicio" + error.message);
    }
};


// Funcion para actualizar un servicio
const UpdateServiceById = async (serviceid, data)=>{
    try {
        // Alctualizacion del servicio por su id
        const updateService = await Services.findByIdAndUpdate(
            serviceid,
            data,
            {new: true} // Retorna el documento actualizado
 
        );
        // Validar si el usuario existe
        if(!updateService) throw new Error("El servicio no existe");
        // retorna el usuario
        return updateService;
        
    } catch (error) {
        // Mensaje de error si algo falla
        throw new Error("Error al actualizar el servicio " + error.message);
    }
};

// Funcion para eliminar un servicio
const DeleteService = async(serviceid)=>{
    try {
        // Eliminacion del servicio por el id
        const deleteservice = await Services.findByIdAndDelete(serviceid);
        // Validar si el servicio existe
        if(!deleteservice) throw new Error("El servicio no existe");
        // Retorna el contacto
        return deleteservice;
      
    } catch (error) {
        // Mensaje de errro si algo falla
        throw new Error("Error al actualizar al servicio" + error.message);
    }
};


// Exportacion de funciones
module.exports = {CreateService, GetAllServices,  GetServiceById, UpdateServiceById, DeleteService };