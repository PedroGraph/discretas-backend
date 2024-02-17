import sizeOf from 'image-size';

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

async function saveImageWithName(name, files) {
    files.map(async (file) => {
        if (!file) {
            logger.warn('File not found');
            throw new Error('File not found');
        }

        const isAImage = await verifyImage(file.buffer);
        if (!isAImage) {
            logger.warn('File is not an image');
            return res.status(400).send('El archivo no es una imagen o tiene una extensión no válida.');
        }

        const productName = name.replaceAll(" ", "_");
        file.originalname = generateFileName(productName, file.originalname);

    })
    return files
}




export { verifyImage, generateFileName, saveImageWithName };
