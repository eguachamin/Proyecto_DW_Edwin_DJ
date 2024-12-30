import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()
//REalizar esto permite confirmar si las variables de entorno se leen correctamente 
//console.log(process.env.USER_MAILTRAP);



let transporter = nodemailer.createTransport({
    service: 'gmail',
    //Usa sevicio gmail
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});
const sendMailToUser = (userMail, token) => {

    let mailOptions = {
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "Verifica tu cuenta",
        html: `<p>Hola, haz clic <a href="${process.env.URL_BACKEND}confirmar/${encodeURIComponent(token)}">aquí</a> para confirmar tu cuenta.</p>`
    };
    

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
};
const sendMailToRecoveryPassword = async(userMail,token)=>{
    let info = await transporter.sendMail({
    from: 'admin@vet.com',
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: `
    <h1>Sistema de gestión (EDWIN DJ 🐶 😺)</h1>
    <hr>
    <a href=${process.env.URL_BACKEND}recuperar-password/${token}>Clic para reestablecer tu contraseña</a>
    <hr>
    <footer>Edwin DJ te da la Bienvenida!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}
const sendMailToCliente = async(userMail,password,nombre)=>{
    let info = await transporter.sendMail({
    from: 'admin@vet.com',
    to: userMail,
    subject: "Correo de bienvenida",
    html: `
    <h1>EDWIN ASHQUI DJ (🎛️🎶🎛️)</h1>
    <h2>Hola ${nombre} !!!</h2>
    <hr>
    <p>Esta es tu contraseña temporal...No olvides cambiarla por seguridad</p>
    <p>Contraseña de acceso: ${password}</p>
    <a href=${process.env.URL_BACKEND}cliente/login>Clic para iniciar sesión</a>
    <p>Ser DJ no se trata solo de poner música; se trata de compartir una visión, un mensaje, una forma de conectar con la gente.<h2>y deseo conectar CONTIGO!!!</h2></p>
    
    <hr>
    <footer>Edwin Ashqui DJ te da la Bienvenida!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

export {
    sendMailToUser,
    sendMailToRecoveryPassword,
    sendMailToCliente
} 