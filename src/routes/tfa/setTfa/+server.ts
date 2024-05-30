import { error, json } from '@sveltejs/kit';

export async function POST({ locals, request }) {
    if (!locals.user) throw error(401, "No user given.");

    const body = await request.json();

    if (!body.enable) throw error(400, "Missing Fields.");

    try {
        await locals.pb.collection('users').update(locals.user.id, { ...locals.user, tfa: body.enable==="1" });
    } catch (err) {
        console.error(err);
        return error(500);
    }
   

    return json({ ok: true });
}