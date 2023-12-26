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
    const fechaActual = new Date().toLocaleDateString().replaceAll('/', '-');
    const extension = originalname.split('.');
    return `${nombredelproducto}_${fechaActual}.${extension[1]}`;
}

async function saveImage(buffer, rutaDirectorio, nombreArchivo) {
    console.log(rutaDirectorio)
    await fs.mkdir(rutaDirectorio, { recursive: true }, (err) => {
        if (err) throw err;
    });
    await fs.writeFileSync(path.join(rutaDirectorio, nombreArchivo), buffer);
}

export { verifyImage, generateFileName, saveImage };
