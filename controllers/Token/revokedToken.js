import { RevokedToken } from '../../models/postgres/revokedToken.js'; 
const addRevokedToken = async (token) => {
    try {
        await RevokedToken.create({ token });
        return true;
    } catch (error) {
        console.error('Error al añadir token revocado:', error);
        throw error;
    }
};

const findRevokedToken = async (token) => {
    try {
        const revokedToken = await RevokedToken.findOne({ where: { token } });
        return revokedToken && revokedToken.length > 0;
    } catch (error) {
        console.error('Error al buscar token revocado:', error);
        throw error;
    }
};

export { addRevokedToken, findRevokedToken };