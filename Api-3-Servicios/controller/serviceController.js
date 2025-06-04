// Obtener en una variable los servicios de la api
const serviceServices = require("../services/serviceServices")

// Peticion para crear un servicio
const createservices = async (req,res)=>{
    try {
        // Crear el nuevo servicio
        const newServices = await serviceServices.CreateService(req.body);
        // Mensaje de servicio creado correctamente
        res.status(201).json(newServices)

    } catch (error) {
        console.error('Error al crear servicio:', error);
        res.status(400).json({ error: 'Failed to create service' });
    }
};


// Peticion para obtener todos los usuarios
const getAllServices= async (req,res)=>{
    try {
        // Obtener todos los servicios
        const services = await serviceServices.GetAllServices();
        // Configuracion del json
        res.status(200).json(services);

    } catch (error) {
        // Mensaje de error por si algo falla
        res.status(400).json({
            error: ("Error fallo la conexion " + error.message),
        });   
    }    
};

// Peticion para obtener un usuario por el id
const getServiceById = async(req,res)=>{
    const {serviceid} = req.params;
    try {
        // Obtener un servicio por el id
        const service = await serviceServices.GetServiceById(serviceid);
        // Configuracion del json
        res.status(200).json(user);
    } catch (error) {
        // Mensaje de error por si algo falla
        res.status(400).json({
            error:error.message
            //error: ("Error al obtener al usuario" + error.message),
        });   
    }
};

// Peticion para actualizar un servicio
const updateService = async (req, res) => {
    const {serviceid} = req.params;
    const userData = req.body;

    try {
        
    } catch (error) {
        
    }
};