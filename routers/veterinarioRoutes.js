import express from "express";
import { perfil, registrar ,confirmar, autenticarUs, resetPassword, comprobarToken, newPassword,perfilUpdate, passwordReseat } from "../controllers/vetControllers.js";
import checkAuth from "../middleware/authMiddleware.js";


const router = express.Router();

// Area publica
router.post('/',registrar);
router.get('/confirmar/:token',confirmar);
router.post('/login', autenticarUs);
router.post('/cambiar-password',resetPassword)
router.get('/cambiar-password/:token',comprobarToken)
router.post('/cambiar-password/:token',newPassword)


// Area privada
router.get('/perfil',checkAuth,perfil);
router.put('/perfil/:id',checkAuth,perfilUpdate)
router.put('/restablecer-password',checkAuth,passwordReseat)




export default router;