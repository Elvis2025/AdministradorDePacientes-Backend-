import nodemailer from 'nodemailer';

const enviarEmail = async(dates)=>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    console.log(dates);
    const {email, nombre,token} = dates;
    // Enviar el email

    const info = await transport.sendMail({
        from: "APV - Administrador de pacientes Veterinaria",
        to: email,
        subject: 'Confirma tu cuenta en APV',
        text: 'Confirma si tu cuenta en APV',
        html:`<p>Hola: ${nombre}, favor de confirmar su cuenta en APV.</p>
        <p> Tu cuenta ya esta lista, solo debes confirmar en el siguiente enlace: 
        <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}">Confirmar Cuenta</a></p>

        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `

    });

    console.log("Mensaje enviado: %s",info.messageId);
}

export default enviarEmail