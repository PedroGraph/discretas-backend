const Profesores = require('../../models/products')

const eliminarProfesores = async (req, res, next) => {
    try {
    // Elimina la tarea con el ID dado
    const profesorEliminado = await
    Profesores.findByIdAndDelete(req.params.id);
    if (!profesorEliminado) {
    res.status(404).json({ message: "Tarea no encontrada" });
    } else {
    res.status(200).json({ message: "Tarea eliminada exitosamente" });
    }
    } catch (err) {
    next(err);
    }
    };
    
module.exports = eliminarProfesores ;