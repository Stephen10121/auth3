import { rpID } from '@/tfa/types';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { error, json } from '@sveltejs/kit';

export async function GET({ locals }) {
    if (!locals.user) {
        throw error(401, "No user given.");
    }

    try {
        const passkeys = await locals.pb.collection("passkeys").getFullList({
            filter: `internal_user_id="${locals.user.id}"`
        });

        const options = await generateAuthenticationOptions({
            rpID,
            // Require users to use a previously-registered authenticator
            allowCredentials: passkeys.map(passkey => ({
                id: passkey.cred_id,
                transports: passkey.transports,
            }))
        });

        // (Pseudocode) Remember this challenge for this user
        await locals.pb.collection('users').update(locals.user.id, { ...locals.user, current_authentication_options: options });

        return json(options);
    } catch (err) {
        console.log(err);

        throw error(500);
    }
}