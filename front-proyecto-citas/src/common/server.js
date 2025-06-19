// Creacion de url de donde se consume la Api-1-usuarios
// const ApiUsuarios = "http://192.168.103.181:3020/api-usuarios/api-1-user/users"
// const ApiUsuarios = "http://192.168.103.85:3006/api-1-user/users"
// const ApiUsuarios = "https://api-gateway-production-2347.up.railway.app/api-usuarios/api-1-user/users"
const ApiUsuarios = "https://api-users-citas-medicas-production.up.railway.app/api-1-user/users"

// Segunda url para generar el login
// const ApiAuth = "http://192.168.103.181:3020/api-login/api-2-auth/login"
//const ApiAuth = "http://192.168.103.126:3007/api-2-auth/login"
//const ApiAuth = "https://api-gateway-production-2347.up.railway.app/api-login/api-2-auth/login"
const ApiAuth = "https://api-2-auth-production.up.railway.app/api-2-auth/login"


// Tercera url para los servicios
const ApiServices = "https://api-3-services-production.up.railway.app/api-3-services/services"
// const ApiServices = "https://api-gateway-production-2347.up.railway.app/api-services/api-3-services/services"
// const ApiServices = "http://192.168.103.181:3020/api-services/api-3-services/services"

//const ApiServices = "http://192.168.103.181:3008/api-3-services/services"

// Cuarta url para los turnos
const ApiTurnos = "https://api-4-turnos-production-92f6.up.railway.app/api-4-turnos/turnos"
// const ApiTurnos = "https://api-gateway-production-2347.up.railway.app/api-turnos/api-4-turnos/turnos"
//const ApiTurnos = "http://192.168.103.181:3020/api-turnos/api-4-turnos/turnos"

//const ApiTurnos = "http://192.168.103.85:3009/api-4-turnos/turnos"

// Exportacion de url
export {ApiUsuarios, ApiAuth, ApiServices, ApiTurnos};