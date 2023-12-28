import { RevokedToken } from '../../models/database/revokedToken.js'; // Ajusta la importación según tu estructura

const addRevokedToken = async (token) => {
    try {
        // Agrega el token revocado a la base de datos
        await RevokedToken.create({ token });
        console.log(`Token revocado añadido: ${token}`);
        return true;
    } catch (error) {
        console.error('Error al añadir token revocado:', error);
        throw error;
    }
};

const findRevokedToken = async (token) => {
    try {
        // Busca el token revocado en la base de datos
        const revokedToken = await RevokedToken.findOne({ where: { token } });

        if (revokedToken) {
            console.log(`Token revocado encontrado: ${token}`);
            return true; // El token está revocado
        } else {
            console.log(`Token no revocado: ${token}`);
            return false; // El token no está revocado
        }
    } catch (error) {
        console.error('Error al buscar token revocado:', error);
        throw error;
    }
};

export { addRevokedToken, findRevokedToken };