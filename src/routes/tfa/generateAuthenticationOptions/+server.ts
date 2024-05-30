import { rpID } from '@/tfa/types';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { error, json } from '@sveltejs/kit';
import type { ClientResponseError, RecordAuthResponse, RecordModel } from 'pocketbase';

export async function POST({ locals, request }) {
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

    try {
        const passkeys = await locals.pb.collection("passkeys").getFullList({
            filter: `internal_user_id="${user.record.id}"`
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
        await locals.pb.collection('users').update(user.record.id, { ...locals.user, current_authentication_options: options });

        return json(options);
    } catch (err) {
        console.log(err);

        throw error(500);
    }
}