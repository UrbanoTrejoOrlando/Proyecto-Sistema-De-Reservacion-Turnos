// Importacion de express
const express = require("express");
// Creacion del enrutador modular
const router = express.Router();
const servicesController = require("../controller/serviceController");

// Definicion de rutas
// Ruta para crear un servicios
router.post("/services", servicesController.createServices);
// Ruta para obtener los servicios
router.get("/services", servicesController.getAllServices);
//Ruta para obtener un servicio por el id
router.get("/services/:serviceid", servicesController.getServiceById);
// Ruta para acualizar el servicio por el id
router.put("/services/:serviceid", servicesController.updateService);
// Ruta para eliminar un servicio por el id
router.delete("/services/:serviceid", servicesController.deleteService);

// Exportacion de rutas
module.exports = router;