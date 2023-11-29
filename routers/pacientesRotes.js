import express  from "express";
import { 
    agregarPacientes,
    obtenerPacientes,
    buscarPacientes,
    actualizarPacientes,
    eliminarPacientes

} from "../controllers/pacientesControllers.js";
import checkAuth from "../middleware/authMiddleware.js"

const router = express.Router();


router.route('/')
    .post(checkAuth,agregarPacientes)
    .get(checkAuth,obtenerPacientes);


router.route('/:id')
    .get(checkAuth,buscarPacientes)
    .put(checkAuth,actualizarPacientes)
    .delete(checkAuth,eliminarPacientes)


export default router;