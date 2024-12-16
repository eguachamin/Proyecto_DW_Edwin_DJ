import mongoose from 'mongoose'
import { sendMailToUser,sendMailToRecoveryPassword } from '../config/nodemailer.js'
import {generarJWT} from '../helpers/crearJWT.js'
import Administrador from '../models/administrador.js'


const registro = async (req,res)=>{
    //Paso 1: Tomar Datos del request
    const {email,password} = req.body
    
    //Paso2: validar Datos
            //values manda al metodo includes y verifica si ningun dato esta vacio 
            //todos los valores del objeto y mira si esta vacio y manda el mensaje 
    if (Object.values(req.body).includes(""))return res.status(404).json({msg:"Lo sentimos debe llenar todos los campos"})
    
    const verificarEmailBDD = await Administrador.findOne({email}) //find one encontrar registro en base al email
    if (verificarEmailBDD)return res.status(400).json({msg:"Lo sentimos el email ya se encuentra registrado"})
     
    //Paso 3 : Interactuar con BDD
    const nuevoAdministrador = new Administrador(req.body)
    nuevoAdministrador.password= await nuevoAdministrador.ecrypPassword(password)
    const token=nuevoAdministrador.crearToken()
    sendMailToUser(email,token)
    await nuevoAdministrador.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta "})
    
}

const confirmEmail = async (req, res) => {
  // Tomar datos del request
    const {token}=req.params
  //Validar datos
    if(!(token)) return res.status(400).json({msg:"Lo sentimos no se puede validar la cuenta"})
    const AdministradorBDD= await Administrador.findOne({token}) //comprobacion si hay un token 
    if(!AdministradorBDD?.token) return res.status(400).json({msg:"La cuenta ya ha sido confirmada"})
  //Interactuar BDD
    AdministradorBDD.token = null
    AdministradorBDD.confirmEmail=true
    await AdministradorBDD.save()

    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"})
}

const login = async (req, res) => {
    //Tomar datos
    const {email,password}=req.body
        //validar datos de campos vacios
    if (Object.values(req.body).includes(""))return res.status(400).json({msg:"Lo sentimos debe llenar todos los campos"})
        //Validamos por variables
        //comprobacion si hay un token 
    const AdministradorBDD= await Administrador.findOne({email}) //primero debemos ver que sea único
    //?se utiliza ese signo para que pueda leer el confirmemail
    if((AdministradorBDD?.confirmEmail===false)) return res.status(400).json({msg:"Lo sentimos debes validar tu cuenta"})
        //comprobacion de los datos ingresados en la base de datos 
    if((!AdministradorBDD)) return res.status(404).json({msg:"Lo sentimos el email no se encuentra registrado"})
    const verificarPassword = await AdministradorBDD.matchPassword(password)
    if(!verificarPassword)return res.status(400).json({msg:"Lo sentimos el password no es correcto"})
    
    
    const {nombre,apellido,direccion,telefono,_id}= AdministradorBDD
    const tokenJWT = generarJWT(AdministradorBDD._id,"Administrador")    
    //res.status(200).json(AdministradorBDD,tokenJWT)
    res.status(200).json({
        nombre,
        apellido,
        direccion,
        telefono,
        _id,
        tokenJWT
    })
}

const recuperarPassword = async (req,res) => {
  //Paso 1: Tomar datos del request
  const {email}=req.body
  //Paso 2:Validaciones
  //campos llenos
  if (Object.values(req.body).includes(""))return res.status(404).json({msg:"Lo sentimos debe llenar todos los campos"})
    //correo registrado
  const AdministradorBDD= await Administrador.findOne({email}) //si hay correo
  if((!AdministradorBDD)) return res.status(404).json({msg:"Lo sentimos el email no se encuentra registrado"})
  //Paso 3: Interaccion con la base de datos 
    const token =AdministradorBDD.crearToken()
    AdministradorBDD.token=token
    await sendMailToRecoveryPassword(email,token)
    await AdministradorBDD.save()
    //envia la respuesta como conclusion par a los pasos 
  res.status(200).json({msg:"Revisa tu correo para restablecer tu contraseña"})
}
const comprobarTokenPassword = async (req,res) => {
    //Paso 1:
    const {token}=req.params
    //Paso 2:
    //token exista
    if(!(token)) return res.status(400).json({msg:"Lo sentimos no se puede validar la cuenta"})
    const AdministradorBDD= await Administrador.findOne({token}) //comprobacion si hay un token 
    //compruebe el token 
    if (AdministradorBDD.token !== token) res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    //Paso 3:
    await AdministradorBDD.save()

    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"})
}
const nuevoPassword = async (req,res) => {
    //Paso 1:
    const {password, confirmpassword} =req.body
    //Paso 2:
    //campos llenos
    if (Object.values(req.body).includes(""))return res.status(400).json({msg:"Lo sentimos debe llenar todos los campos"})
        //password inguales
    if(password != confirmpassword) return res.status(400).json({msg:"Lo sentimos los password no coinciden"})
    const AdministradorBDD= await Administrador.findOne({token:req.params.token})
    if (AdministradorBDD.token != req.params.token) res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"}) //token al capturar debe ser el misno que la base de datos
    //Paso 3:
    AdministradorBDD.token = null
    AdministradorBDD.password = await AdministradorBDD.ecrypPassword(password)
    await AdministradorBDD.save()

    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"})
}

const perfilUsuario = async (req,res) => {
    delete req.AdministradorBDD.token
    delete req.AdministradorBDD.confirmEmail
    delete req.AdministradorBDD.createdAt
    delete req.AdministradorBDD.updatedAt
    delete req.AdministradorBDD.__v
    res.status(200).json(req.AdministradorBDD)

}

const actualizarPerfil = async (req,res) => {
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const AdministradorBDD = await Administrador.findById(id)
    if(!AdministradorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el Administrador ${id}`})
    if (AdministradorBDD.email !=  req.body.email)
    {
        const AdministradorBDDMail = await Administrador.findOne({email:req.body.email})
        if (AdministradorBDDMail)
        {
            return res.status(404).json({msg:`Lo sentimos, el existe ya se encuentra registrado`})  
        }
    }
	  AdministradorBDD.nombre = req.body.nombre || AdministradorBDD?.nombre
    AdministradorBDD.apellido = req.body.apellido  || AdministradorBDD?.apellido
    AdministradorBDD.direccion = req.body.direccion ||  AdministradorBDD?.direccion
    AdministradorBDD.telefono = req.body.telefono || AdministradorBDD?.telefono
    AdministradorBDD.email = req.body.email || AdministradorBDD?.email
    await AdministradorBDD.save()
    res.status(200).json({msg:"Perfil actualizado correctamente"})
  }
const cambiarPassword = async (req,res) => {
    const AdministradorBDD = await Administrador.findById(req.AdministradorBDD._id)
    if(!AdministradorBDD) return res.status(404).json({msg:`Lo sentimos, no existe el Administrador ${id}`})
    const verificarPassword = await AdministradorBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
    AdministradorBDD.password = await AdministradorBDD.ecrypPassword(req.body.passwordnuevo)
    await AdministradorBDD.save()
    res.status(200).json({msg:"Password actualizado correctamente"})
  }


export{
    registro,
    confirmEmail,
    login,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword,
    perfilUsuario,
    actualizarPerfil,
    cambiarPassword
}