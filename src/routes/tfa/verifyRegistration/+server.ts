import { rpID, type Passkey } from '@/tfa/types';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { error, json } from '@sveltejs/kit';

export async function POST({ locals, request }) {
    if (!locals.user) throw error(401, "No user given.");

    const body = await request.json();

    const user = await locals.pb.collection("users").getOne(locals.user.id);
    const currentOptions = user.current_registration_options;

    let verification;
    try {
        verification = await verifyRegistrationResponse({
            response: body,
            expectedChallenge: currentOptions.challenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
        });
    } catch (err) {
        console.error(err);

        //@ts-ignore
        throw error(400, err.message);
    }

    const { verified } = verification;

    if (verified) {
        const { registrationInfo } = verification;
        if (registrationInfo) {
            const {
                credentialID,
                credentialPublicKey,
                counter,
                credentialDeviceType,
                credentialBackedUp
            } = registrationInfo;
    
            const newPasskey: Passkey = {
                // A unique identifier for the credential
                cred_id: credentialID,
                // The public key bytes, used for subsequent authentication signature verification
                cred_public_key: credentialPublicKey,
                // `user` here is from Step 2
                internal_user_id: user.id,
                // Created by `generateRegistrationOptions()` in Step 1
                webauthn_user_id: currentOptions.user.id,
                // The number of times the authenticator has been used on this site so far
                counter,
                // Whether the passkey is single-device or multi-device
                device_type: credentialDeviceType,
                // Whether the passkey has been backed up in some way
                backup_status: credentialBackedUp,
                // `body` here is from Step 2
                transports: body.response.transports
            };
    
            // (Pseudocode) Save the authenticator info so that we can
            // get it by user ID later
            const record = await locals.pb.collection('passkeys').create(newPasskey);

            console.log(record);
        }
    }

    return json({ verified });
}