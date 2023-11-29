import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarWJT.js";
import generarId from "../helpers/generarId.js";
import enviarEmail from "../helpers/envioEmails.js"
import cambiarPassword from "../helpers/envioEmailPassword.js";

const registrar = async(req,res)=>{


    // console.log(req.body);

    const {nombre,email} = req.body;
    // Revisar usuarios duplicados 
    const existeUsuario = await Veterinario.findOne({email});
    if(existeUsuario){
        // console.log(`El email: "${email}" ya existe`);
        const error = new Error(`El email : "${email} ya existe... Usuario ya registrado..."`);
        return res.status(400).json({msg: error. message})
    }
    
    try {
        // Guardar un Nuevo Veterinario 
        const vet = new Veterinario(req.body);
        const vetSave = await vet.save();
        // Enviar un email
        enviarEmail({
            email,
            nombre,
            token: vetSave.token
        });


        res.json(vetSave)
    } catch (error) {
        console.log(error);
    }

}

const perfil = (req,res)=>{
    const {veterinario}=req;
    res.json(veterinario)
}

const confirmar = async (req,res) => {
    const {token} = req.params;

    const confirmarUsuario = await Veterinario.findOne({token});

    console.log(confirmarUsuario);
    if(!confirmarUsuario){
        const error = new Error("Este Usuario no se encuentra autenticado");
        return res.status(404).json({msg: error.message});
    }
    try {
        confirmarUsuario.token = null;
        confirmarUsuario.confirmado = true;
        await confirmarUsuario.save();
        res.json({msg: "Usuario confirmado correctamente..."})
    } catch (error) {
        console.log(error);
    }
    console.log(confirmarUsuario);
}

const autenticarUs = async (req,res) => {
    const {email,password} = req.body

    // Comprobar si el usuario existe 
    const usuario = await Veterinario.findOne({email})

    if(!usuario){
        const error = new Error('Este Usuario no existe');
        return res.status(404).json({msg: error.message});
    }

    // Comprobar si el usuario esta comfirmado o no 
    if(!usuario.confirmado){
        
        const error = new Error('Tu cuenta aún no ha sido confirmada, Revisa tu email!!!');
        return res.status(404).json({msg: error.message});        
    }

    // autenticando el usuario atravez del password 
    if(await usuario.comprobarPassword(password)){
        // Autenticar el usuario 
        // console.log(usuario);
        // usuario.token = 
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });

        // console.log('Password correcto');
        // const error = new Error('password correcto!!!');
        // return res.status(404).json({msg: error.message});
    }else{
        console.log('Password incorrecto');
        const error = new Error('Tu password es incorrecto!!!');
        return res.status(404).json({msg: error.message});
    }

};

const resetPassword = async (req,res) => {
    const { email } = req.body

    const existeVeterinario = await Veterinario.findOne({email})
    if(!existeVeterinario){
        const error = new Error('El usuario no existe');
        return res.status(400).json({msg: error.message})

    }
    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();
        // Enviar el email con las instrucciones
        cambiarPassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({msg: 'Hemos enviado un email con las instrucciones.'})
    } catch (error) {
        console.log(error);
    }

}
const comprobarToken = async (req,res) => {
    const {token} = req.params;
    const tokenValido = await Veterinario.findOne({token})

    if(tokenValido){
        // El token es valido
        res.json({msg: "Token válido"})

    }else{
        const error = new Error("Token no válido")
        return res.status(400).json({msg: error.message})
    }
    console.log(token);
}
const newPassword = async (req,res) => {
    const {token} = req.params
    const {password} = req.body

    const veterinario = await Veterinario.findOne({token})
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    try {
        veterinario.token = null;
        veterinario.password = password
        console.log(veterinario);
        await veterinario.save();
        res.json({msg: 'clave reseteada'})
        
    } catch (error) {
        console.log(error);
    }
}

const perfilUpdate = async (req,res) =>{
   const vet = await Veterinario.findById(req.params.id)
    if(!vet){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message})
    }

    const {email} = req.body

    if(vet.email !== req.body){
        const dobleEmail = await Veterinario.findOne({email});
        if(dobleEmail){
            const error = new Error('Este Email ya existe');
            return res.status(400).json({msg: error.message})
        }
    }
    try {
        vet.nombre = req.body.nombre || vet.nombre
        vet.email = req.body.email || vet.email
        vet.web = req.body.web
        vet.telefono = req.body.telefono

        const vetUpdate = await vet.save()
        res.json(vetUpdate)

    } catch (error) {
        console.log(error);
    }   
}

const passwordReseat = async(req,res) =>{
    // Leer los datos 
    const {id} = req.veterinario
    const {clave_A,N_clave} = req.body


    // Comprobar que el veterinario exista 
    const vet = await Veterinario.findById(id)
    console.log(req.body);
    console.log(clave_A);
    
    //  Compropar el Password 
    if(!await vet.comprobarPassword(clave_A)){
        const error = new Error('Tu conraseña actual es incorrecta');
        return res.status(400).json({msg: error.message})
    }

    // Almacenar el nuevo password
    vet.password = N_clave;
    await vet.save();
    res.json({msg: 'Contraseña Actualisada correctamente'})
    
}
export {
    registrar,
    perfil,
    confirmar,
    autenticarUs,
    resetPassword,
    comprobarToken,
    newPassword,
    perfilUpdate,
    passwordReseat
}