import {Router} from "express"
import { actualizarUsuario, detalleUsuario, eliminarUsuario, listarUsuarios, loginUsuario, perfilUsuario, registrarUsuario } from "../controllers/usuario_controller.js"
import { verificarAutenticacion } from "../helpers/crearJWT.js"
const router = Router() 

//Ruta login administrador
//Ruta para listar usuarios
router.get('/usuarios',verificarAutenticacion,listarUsuarios)
//Ruta detalle del usuario
router.get('/usuario/:id',verificarAutenticacion,detalleUsuario)


    //Rutas para el cliente
router.post('/usuario/login',loginUsuario)
//Ruta visualizar el perfil
router.get('/usuario/perfil/:id',perfilUsuario)
//Ruta para actualizar usuario
router.put('/usuario/actualizar/:id',actualizarUsuario)
//Ruta eliminar usuario
router.delete('/usuario/eliminar/:id',eliminarUsuario)
//Ruta para registrar usuario
router.post('/usuario/registro',registrarUsuario)

export default router