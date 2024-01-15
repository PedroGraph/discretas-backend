import sizeOf from 'image-size';
import fs from 'fs';
import path from 'path';

async function verifyImage(buffer) {
    try {
        const dimensions = sizeOf(buffer);
        return dimensions.width > 0 && dimensions.height > 0;
    } catch (error) {
        return false;
    }
}

function generateFileName(nombredelproducto, originalname) {
    const generateRandomNumber = () => {
        const number = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
        return `${number}${randomLetter}`;
    }
    const fechaActual = new Date().toLocaleDateString().replaceAll('/', '-');
    const extension = originalname.split('.');
    return `${nombredelproducto}_${fechaActual}_${generateRandomNumber()}.${extension[1]}`;
}

async function saveImage(buffer, rutaDirectorio, nombreArchivo) {
    await fs.mkdir(rutaDirectorio, { recursive: true }, (err) => {
        if (err) throw err;
    });
    await fs.writeFileSync(path.join(rutaDirectorio, nombreArchivo), buffer);
}

export { verifyImage, generateFileName, saveImage };
