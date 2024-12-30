import {Router} from "express"
import { actualizarCliente, detalleCliente, eliminarCliente, listarClientes, loginCliente,  perfilCliente, registrarCliente } from "../controllers/cliente_controller.js"
import { verificarAutenticacion } from "../helpers/crearJWT.js"
const router = Router() 
//Para la realización de las Rutas es necesario que sea en orden 

//Ruta para registrar cliente
router.post('/cliente/registro',registrarCliente)

//Rutas para el cliente
router.post('/cliente/login',loginCliente)
//Ruta visualizar el perfil
router.get('/cliente/perfil/:id',perfilCliente)
//Ruta para actualizar cliente
router.put('/cliente/actualizar/:id',actualizarCliente)
//Ruta eliminar cliente
router.delete('/cliente/eliminar/:id',eliminarCliente)

//Ruta para listar clientes
router.get('/clientes',verificarAutenticacion,listarClientes)
//Ruta detalle del cliente
router.get('/cliente/:id',verificarAutenticacion,detalleCliente)


export default router