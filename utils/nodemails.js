import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { config } from 'dotenv';
import { Resend } from 'resend';
config();

function renderEmailTemplate(data, templatePath) {
    let template = fs.readFileSync(templatePath, 'utf8');
    Object.keys(data).forEach(key => {
        if (key === 'products') {
            template = template.replace(new RegExp(`{{products}}`, 'g'), data[key].map(product => `
                <div class="item">
                    <div class="item-details">
                        <span>${product.name}</span>
                        <span>
                            ${product.discount === 0 ? `<span class="base-price">$${product.price.toFixed(2)}</span>` : ''}
                            ${product.discount > 0 ? `<span class="original-price">$${(product.price * product.discount).toFixed(2)}</span>` : ''}
                            ${product.discount > 0 ? `<span class="discount">$${product.price}</span>` : ''}
                        </span>
                    </div>
                    <div class="item-details">
                        <span class="badge">Cantidad: ${product.quantity}</span>
                        ${product.size ? `<span class="badge">${product.size}</span>` : ''}
                        ${product.color ? `<span class="badge">${product.color}</span>` : ''}
                        ${product.discount > 0 ? `<span class="badge discount">-${product.discount * 100}%</span>` : ''}
                    </div>
                </div>
            `).join(''));
        } else {
            template = template.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
        }
    });
    return template;
}


export const sendPasswordRecoveryEmail = async (data) => {
    try {
        
        const templatePath = path.join(process.cwd(), 'templates', 'passwordRecoveryMail.html');
        const API_KEY = process.env.RESEND_API_KEY;
        const resend = new Resend(API_KEY);
        
        console.log("Renderizando plantilla de correo...");
        const htmlContent = renderEmailTemplate({
            ConfirmationURL: data.recoveryUrl,
            Token: data.resetToken,
            SiteURL: process.env.SITE_URL,
            Email: data.email,
            Year: new Date().getFullYear(),
        }, templatePath);

        const mailOptions = {
            from: `onboarding@resend.dev`,
            to: data.email,
            subject: "Recuperación de Contraseña",
            html: htmlContent,
        };

        console.log(`Enviando correo a ${data.email}...`);
        const result = await resend.emails.send(mailOptions);
        console.log("Correo enviado con éxito:", result);
        return result;
    } catch (error) {
        console.error("Error enviando correo:", error);
        if (error.response) {
            console.error("Detalles del error:", error.response.data);
        }
        throw new Error("No se pudo enviar el correo: " + error.message);
    }
};

async function generatePDF(htmlContent, outputPath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
    });

    await browser.close();
    return outputPath;
}

export const sendReceiptEmail = async (data) => {
    try {
        const pdfTemplatePath = path.join(process.cwd(), 'templates', 'receipt.html');
        const emailTemplatePath = path.join(process.cwd(), 'templates', 'receiptEmail.html');

        const API_KEY = process.env.RESEND_API_KEY;
        const resend = new Resend(API_KEY);
        
        console.log("Renderizando plantilla de correo...");
        const htmlContent = renderEmailTemplate(data, pdfTemplatePath);
        const emailContent = renderEmailTemplate(data, emailTemplatePath);

        console.log("Generando PDF...");
        const pdfPath = path.join(process.cwd(), 'receipts', `receipt-${data.orderId}.pdf`);
        await generatePDF(htmlContent, pdfPath);
        console.log("PDF generado en:", pdfPath);

        const pdfBuffer = fs.readFileSync(pdfPath);

        const mailOptions = {
            from: `onboarding@resend.dev`,
            to: "peterjosmed@gmail.com",
            subject: "Recibo de Compra",
            html: emailContent,
            attachments: [
                {
                    filename: 'receipt.pdf',
                    content: pdfBuffer.toString('base64'),
                    encoding: 'base64',
                }
            ]
        };

        console.log(`Enviando correo a peterjosmed@gmail.com...`);
        const result = await resend.emails.send(mailOptions);
        console.log("Correo enviado con éxito:", result);

        return pdfPath;
    } catch (error) {
        console.error("Error enviando correo:", error);
        if (error.response) {
            console.error("Detalles del error:", error.response.data);
        }
        throw new Error("No se pudo enviar el correo: " + error.message);
    }
};