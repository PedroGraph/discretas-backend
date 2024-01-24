import sizeOf from 'image-size';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

async function saveImageIntoPath(body, file) {
    if (!file) {
        logger.warn('File not found');
        throw new Error('File not found');
    }

    const isAImage = await verifyImage(file.buffer);
    if (!isAImage) {
        logger.warn('File is not an image');
        return res.status(400).send('El archivo no es una imagen o tiene una extensión no válida.');
    }

    const productName = body.productName.replaceAll(" ", "_");
    const fileName = generateFileName(productName, file.originalname);
    const filepath = path.resolve(__dirname, '..', '..', 'public', 'uploads', productName);
    await saveImage(file.buffer, filepath, fileName);

    return {
        imageName: fileName,
        imagePath: filepath,
    }
}




export { verifyImage, generateFileName, saveImage, saveImageIntoPath };
