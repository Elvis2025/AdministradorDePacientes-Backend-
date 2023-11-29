import nodemailer from 'nodemailer';

const cambiarPassword = async(dates)=>{
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
        subject: 'Reestablece tu Password',
        text: 'Reestablece tu Password en APV',
        html:`<p>Hola: ${nombre}, has solicitado reestablecer tu password en APV.</p>
        <p> Sigue el siguiente enlace para reestablecer tu password: 
        <a href="${process.env.FRONTEND_URL}/cambiar-password/${token}">Cambiar Password</a></p>

        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `

    });

    console.log("Mensaje enviado: %s",info.messageId);
}

export default cambiarPassword