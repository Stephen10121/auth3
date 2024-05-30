import { rpID, origin } from '@/tfa/types';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { error, json } from '@sveltejs/kit';

export async function POST({ locals, request }) {
    if (!locals.user) throw error(401, "No user given.");

    const body = await request.json();

    if (!body.id) throw error(400, "Missing Fields.");

    let passkey;
    try {
        passkey = await locals.pb.collection("passkeys").getFirstListItem(`internal_user_id="${locals.user.id}" && id="${body.id}"`);

    } catch (err) {
        console.error(err);
        return error(500);
    }

    if (!passkey) {
        return error(401, "Missing Fields.");
    }

    try {
        await locals.pb.collection('passkeys').delete(body.id);
    } catch (err) {
        console.error(err);
        return error(500);
    }
   

    return json({ ok: true });
}