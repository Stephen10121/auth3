import { addLogin, type LoginRecord } from '@/addLogin';
import { rpID, origin } from '@/tfa/types';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { error, json } from '@sveltejs/kit';
import type { ClientResponseError, RecordAuthResponse, RecordModel } from 'pocketbase';

export async function POST({ locals, request, getClientAddress }) {
    const body = await request.json();

    if (!body.username || !body.password) {
        throw error(401, "Missing Credentials.");
    }

    let user: RecordAuthResponse<RecordModel>;

    try {
        user = await locals.pb.collection("users").authWithPassword(body.username as string, body.password as string);
    } catch (err) {
        let error2 = err as any as ClientResponseError;
        let errorList = Object.keys(error2.response.data);
        if (errorList.length === 0) {
            return error(400, `Couldn't authenticate user.`);
        }
        return error(400, `Couldn't authenticate user.`);
    }

    if (!user) {
        return error(400, `Couldn't authenticate user.`);
    }

    const currentOptions = user.record.current_authentication_options;

    let passkey;
    try {
        passkey = await locals.pb.collection("passkeys").getFirstListItem(`internal_user_id="${user.record.id}" && cred_id="${body.id}"`);
    } catch (err) {
        console.error(err);
        return error(404, `Could not find passkey ${body.id} for user ${user.record.id}`);
    }

    if (!passkey) {
        return error(404, `Could not find passkey ${body.id} for user ${user.record.id}`);
    }

    let credPublicKey: Uint8Array;
    try {
        credPublicKey = Uint8Array.from(Object.keys(passkey.cred_public_key).map((key) => passkey.cred_public_key[key]));
    } catch (err) {
        console.log(err);
        return error(500);
    }

    let verification;
    try {
        verification = await verifyAuthenticationResponse({
            response: body,
            expectedChallenge: currentOptions.challenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            authenticator: {
                credentialID: passkey.cred_id,
                credentialPublicKey: credPublicKey,
                counter: passkey.counter,
                transports: passkey.transports,
            }
        });
    } catch (err) {
        console.error(err);

        //@ts-ignore
        throw error(400, {error: err.message});
    }

    const { verified } = verification;

    if (verified) {
        const { authenticationInfo } = verification;
        const { newCounter } = authenticationInfo;

        try {
            await locals.pb.collection('passkeys').update(passkey.id, { ...passkey, counter: newCounter, usage: passkey.usage+1 });
        } catch(err) {
            console.log("[server] Couldn't update passkey counter.");
            console.log(err);

            return error(500);
        }
        
        let userAgent = request.headers.get("user-agent");
        
        let deviceInfo: LoginRecord["deviceInfo"];
        try {
            if (!body.wurfl) {
                deviceInfo = {
                    complete_device_name: "unknown",
                    form_factor: "unknown",
                    is_mobile: false
                }
            } else {
                deviceInfo = JSON.parse(body.wurfl as string);
            }
        } catch(err) {
            deviceInfo = {
                complete_device_name: "unknown",
                form_factor: "unknown",
                is_mobile: false
            }
        }

        await addLogin({
            record: user.record, 
            locals,
            ip: getClientAddress(),
            service: "GAuth",
            deviceType: deviceInfo.complete_device_name,
            userAgent: userAgent ? userAgent : "None Detected",
            deviceInfo,
            passkeyUsed: passkey.name
        });
        
        return json({ verified });
    }
}