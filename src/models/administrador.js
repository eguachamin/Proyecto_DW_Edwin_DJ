import {Schema, model} from 'mongoose'
import bcrypt from "bcryptjs"
//Se crea un objeto y se lo hace con una base de datos no relacional 

const AdministradorSchema =new Schema({
    nombre:{
        type:String,
        require:true,
        trim:true //trim:true es que los espacios en blanco se elimine 
        //solo se tome la palabra 
    },
    apellido:{
        type:String,
        require:true,
        trim:true
    },
    direccion:{
        type:String,
        trim:true,
        default:null //si no se llena lo llena con null en la base de datos
    },
    telefono:{
        type:Number,
        trim:true,
        default:null
    },
    email:{
        type:String,
        require:true,
        trim:true,
		unique:true // sea un mail unico .. evita que se repitan
    },
    password:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        default:true
    },
    token:{
        type:String,
        default:null
    },
    confirmEmail:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true //hacemos un registro se crea un campo de cuando ha sido creado y cuando ha sido actualizado
})
//Métodos    
// Método para cifrar el password del Administrador
// se moldea antes de que se guarde en la base de datos 
    AdministradorSchema.methods.ecrypPassword = async function (password) {
        const salt = await bcrypt.genSalt(10) //se hace los saltos 
        const passwordEncryp =await bcrypt.hash(password,salt)
        return passwordEncryp
    }
// Método para verificar si el password ingresado es el mismo de la BDD
AdministradorSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}

// Método para crear un token 
//este es un tken que se va a enviar al correo electrónico 
AdministradorSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2) //genera un numero random entre letras y caracteres 
    return tokenGenerado //this.token hace referencia al token definido 
}

//Modelo
//exportar este modelo con el nombre vevterinario con el esquema que le mandamos 
export default model('Administrador',AdministradorSchema)