import QRCode from 'qrcode';

const generateQR = async (text) => {
    try {
        return await QRCode.toDataURL(text);
    } catch (err) {
        console.error(err);
        return null;
    }
};

export default generateQR;
