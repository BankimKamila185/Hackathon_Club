import generateQR from './utils/generateQR.js';
import { validateEmail, validatePassword } from './utils/validators.js';
import fs from 'fs';

const verifyUtilities = async () => {
    console.log('--- Verifying Utilities ---');

    // Test Validators
    console.log('Testing Validators...');
    const validEmail = 'test@example.com';
    const invalidEmail = 'test-example';
    console.log(`Email '${validEmail}' valid? ${validateEmail(validEmail)}`);
    console.log(`Email '${invalidEmail}' valid? ${validateEmail(invalidEmail)}`);

    const validPass = 'Password123';
    const invalidPass = 'pass';
    console.log(`Password '${validPass}' valid? ${validatePassword(validPass)}`);
    console.log(`Password '${invalidPass}' valid? ${validatePassword(invalidPass)}`);

    // Test QR Code
    console.log('\nTesting QR Code Generation...');
    const qr = await generateQR('https://example.com');
    if (qr && qr.startsWith('data:image/png;base64')) {
        console.log('QR Code generated successfully.');
    } else {
        console.error('QR Code generation failed.');
    }

    console.log('\n--- Verification Complete ---');
};

verifyUtilities();
