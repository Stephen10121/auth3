import { rpID, origin } from '@/tfa/types';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { error, json } from '@sveltejs/kit';

export async function POST({ locals, request }) {
    if (!locals.user) throw error(401, "No user given.");

    const body = await request.json();

    const user = await locals.pb.collection("users").getOne(locals.user.id);
    const currentOptions = user.current_authentication_options;

    const passkey = await locals.pb.collection("passkeys").getFirstListItem(`id="${body.id}"`, {
        filter: `webauthn_user_id="${user.id}"`
    });

    if (!passkey) {
        return error(404, `Could not find passkey ${body.id} for user ${user.id}`);
    }

    let verification;
    try {
        verification = await verifyAuthenticationResponse({
            response: body,
            expectedChallenge: currentOptions.challenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            authenticator: {
                credentialID: passkey.id,
                credentialPublicKey: passkey.cred_public_key,
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
            await locals.pb.collection('passkeys').update(passkey.id, { ...passkey, counter: newCounter });
        } catch(err) {
            console.log("[server] Couldn't update passkey counter.");
            console.log(err);

            return error(500);
        }
    }

    return json({ verified });
}