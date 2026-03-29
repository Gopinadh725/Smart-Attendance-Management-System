import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const getDeviceId = async () => {
    // 1. Initialize the agent at application startup.
    const fpPromise = FingerprintJS.load();

    // 2. Get the visitor identifier when you need it.
    const fp = await fpPromise;
    const result = await fp.get();

    // 3. This 'visitorId' is the unique alphanumeric string for the device
    return result.visitorId; 
};