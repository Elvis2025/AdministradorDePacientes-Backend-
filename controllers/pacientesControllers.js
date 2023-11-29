import Paciente from "../models/Pacientes.js";


const agregarPacientes = async (req,res) => {
    
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;
    // console.log(req.body);
    // console.log(paciente);
    // console.log(req.veterinario);
    try {
        // console.log(req.veterinario._id);
        const pacienteGuardado = await paciente.save();
        return res.json({pacienteGuardado})
    } catch (error) {
        console.log(error);
    }
}
const obtenerPacientes = async(req,res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);

    res.json(pacientes);
}

const buscarPacientes = async(req,res) => {

    const {id} = req.params;
    const paciente = await Paciente.findById(id)
    if(!paciente){
        res.status(404).json({msg: 'paciente no encontrado...'})        
    }
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: "Accion no válida, Este paciente no coincide con su veterinario...."});
    }
    if(paciente){
        res.json({paciente})
    }else{
        res.status(404).json({msg: 'paciente no encontrado...'})
    }
    // console.log(paciente);
}
const actualizarPacientes = async(req,res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id)

    if(!paciente){
       return res.status(404).json({msg: 'paciente no encontrado...'})        
    }
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: "Accion no válida, Este paciente no coincide con su veterinario...."});
    }

        // Actualizar pacientes
    // res.json({paciente})

    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)

    } catch (error) {
        console.log(error);
    }
    
};
const eliminarPacientes = async(req,res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id)

    if(!paciente){
       return res.status(404).json({msg: 'paciente no encontrado...'})        
    }
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: "Accion no válida, Este paciente no coincide con su veterinario...."});
    }

    // Eliminar pacientes
    try {
        await paciente.deleteOne()
        res.json({msg: 'paciente eliminado'})
    } catch (error) {
        console.log(error);

    }
}

export{
    agregarPacientes,
    obtenerPacientes,
    buscarPacientes,
    actualizarPacientes,
    eliminarPacientes
}