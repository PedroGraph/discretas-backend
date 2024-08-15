
import admin from 'firebase-admin'
import env from 'dotenv';
env.config();
const serviceAccount = JSON.parse(process.env.GOOGLE_CLOUD_KEY);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount)});

export const verifyGoogleToken = async (token) => {
    try {
        const ticket = await admin.auth().verifyIdToken(token);
        return ticket;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const uploadFilesToGoogelStorage = async (file) => {
    try {
        const bucket = admin.storage().bucket();
        const fileUpload = bucket.file(file.originalname);
        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        await new Promise((resolve, reject) => {
            stream.on('error', (error) => {
                console.log(error);
                reject(error);
            });
            
            stream.on('finish', () => {
                resolve();
            });
            
            stream.end(file.buffer);
        });

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        return publicUrl;
        
    } catch (error) {
        console.log(error.GaaxiosError);
        return null;
    }
};


