import { mongoose,Schema,model} from 'mongoose'
import bcrypt from "bcryptjs"

const clienteSchema = new Schema({
    nombre:{
        type:String,
        require:true,
        trim:true
    },
    ciudad:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true
    },
    password:{
        type:String,
        require:true
    },
    celular:{
        type:String,
        require:true,
        trim:true
    },
    convencional:{
        type:String,
        require:true,
        trim:true
    },
    fecha_nacimiento:{
        type:Date,
        require:true,
        trim:true
    },
    token:{
        type:String,
        default:null
    },
    estado:{
        type:Boolean,
        default:true
    }
    
},{
    timestamps:true
})


// Método para cifrar el password del usuario
clienteSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}

// Método para verificar si el password ingresado es el mismo de la BDD
clienteSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}
clienteSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2) //genera un numero random entre letras y caracteres 
    return tokenGenerado //this.token hace referencia al token definido 
}

export default model('Cliente',clienteSchema)