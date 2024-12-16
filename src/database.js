import mongoose from 'mongoose'

mongoose.set('strictQuery', true)
//Funcion connection 
//cuando se ejecuta se hace una variable conexion  
const connection = async()=>{
    try {
        //Variable desestruturar la variable conecction 
        const {connection} = await mongoose.connect(process.env.MONGODB_URI_LOCAL) //vvariable en el  archivo env
        console.log(`Database is connected on ${connection.host} - ${connection.port}`) //mensaje para saber si esta ok o no 
    } catch (error) {
        console.log(error); //mensaaje de error
    }
}
//exportar la funcion 
export default  connection