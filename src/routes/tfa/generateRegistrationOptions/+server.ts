import { rpID, rpName } from '@/tfa/types';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { error, json } from '@sveltejs/kit';

export async function GET({ locals }) {
    if (!locals.user) {
        throw error(401, "No user given.");
    }
    try {
        const passkeys = await locals.pb.collection("passkeys").getFullList({
            filter: `internal_user_id="${locals.user.id}"`
        });

        const options = await generateRegistrationOptions({
            rpName,
            rpID,
            userName: locals.user.username,
            // Don't prompt users for additional information about the authenticator
            // (Recommended for smoother UX)
            attestationType: 'none',
            // Prevent users from re-registering existing authenticators
            excludeCredentials: passkeys.map(passkey => ({
                id: passkey.id,
                // Optional
                transports: passkey.transports,
            })),
            // See "Guiding use of authenticators via authenticatorSelection" below
            authenticatorSelection: {
                // Defaults
                residentKey: 'preferred',
                userVerification: 'preferred',
                // Optional
                authenticatorAttachment: 'platform',
            },
        });

        await locals.pb.collection('users').update(locals.user.id, { ...locals.user, current_registration_options: options });

        return json({ options });
    } catch (err) {
        console.log(err);

        throw error(500);
    }
}