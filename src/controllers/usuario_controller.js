import { sendMailToUsuario } from "../config/nodemailer.js"
import { generarJWT } from "../helpers/crearJWT.js"
import Usuario from "../models/usuario.js"

const loginUsuario = async (req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const usuarioBDD = await Usuario.findOne({email})
    if(!usuarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const verificarPassword = await usuarioBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    const token = generarJWT(usuarioBDD._id,"usuario")
	const {nombre,email:emailP,celular,convencional,_id} = usuarioBDD
    res.status(200).json({
        
        nombre,
        emailP,
        celular,
        convencional,
        token,
        _id
    })
}
const perfilUsuario = async (req,res)=>{
    const {id} = req.params
    const usuario = await Usuario.findById(id).select('-createdAt -updatedAt -__v');
    if( !usuario ) return res.status(404).json({msg:`Lo sentimos, no existe el usuario ${id}`});
    res.status(200).json({usuario})
}

const listarUsuarios = async(req,res)=>{
    const usuarios = await Usuario.find({estado:true}).select(" -createdAt -updatedAt -__v")
    res.status(200).json(usuarios)
    //Debemos integrar para que lea o que el admin pueda colocar rol o una seguridad arreglarlo 
}

const detalleUsuario = async (req,res)=>{
    try {
        const { id } = req.params;
        //console.log('ID recibido:', id); // Para verificar que el ID llegue correctamente

        const usuario = await Usuario.findById(id).select('-createdAt -updatedAt -__v');
        
        if (!usuario) {
            return res.status(404).json({ msg: `El usuario con ID ${id} no existe.` });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        res.status(500).json({ msg: 'Error al obtener el usuario', error });
    }
}

const registrarUsuario = async(req,res)=>{
    const {email,nombre}=req.body
    //Paso 2: Validación de Datos
        //Llenar todos los campos
    if (Object.values(req.body).includes(""))return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        //email no repetido
    const verificarEmailBDD = await Usuario.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    //Paso 3: Interacción de BDD
    const nuevoUsuario = new Usuario (req.body)
        //generar numro random variable password
    const password = Math.random().toString(36).slice(2)
        //usuario en el campo password encrtar password vet al inicio con el anterior
    nuevoUsuario.password= await nuevoUsuario.encrypPassword("nw"+password)
        //envia el email y la contraseña de acceso
    const token=nuevoUsuario.crearToken()
    await sendMailToUsuario(email,"nw"+password,nombre,token)
    await nuevoUsuario.save()
    res.status(200).json({msg:"Su registro fue exitoso, registro enviado al mail"})
}

const actualizarUsuario = async (req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const usuario = await Usuario.findById(id).select('-createdAt -updatedAt -__v');
    if( !usuario ) return res.status(404).json({msg:`Lo sentimos, no existe el usuario ${id}`});
    await Usuario.findByIdAndUpdate(req.params.id,req.body)
    res.status(200).json({msg:"Se actualizaron correctamente sus datos"})
}

const eliminarUsuario =async (req,res)=>{
    const {id} = req.params
    const usuario = await Usuario.findById(id).select('-createdAt -updatedAt -__v');
    if( !usuario ) return res.status(404).json({msg:`Lo sentimos, no existe el usuario ${id}`});
    await Usuario.findByIdAndUpdate(req.params.id,{email:null,estado:false})
    res.status(200).json({msg:"Su cuenta se encuentra elimanada"})
}

export {
	loginUsuario,
	perfilUsuario,
    listarUsuarios,
    detalleUsuario,
    registrarUsuario,
    actualizarUsuario,
    eliminarUsuario
}