import type { PublicAuthClient } from '@/utils.js';
import { redirect } from '@sveltejs/kit';

export async function load({ parent, locals }) {
    await parent();

    if (!locals.user) throw redirect(303, "/");

    let authClients: PublicAuthClient[] = [];

    try {
        const authClientsRaw = await locals.pb.collection("authClient").getFullList({
            filter: `owner="${locals.user.id}"`
        });

        for (let i=0;i<authClientsRaw.length;i++) {
            authClients.push({
                id: authClientsRaw[i].id,
                owner: authClientsRaw[i].owner,
                authorized_origins: authClientsRaw[i].authorized_origins,
                authorized_redirects: authClientsRaw[i].authorized_redirects,
                name: authClientsRaw[i].name
            });
        }
    } catch (err) {
        console.log(err);
    }

    return {
        authClients
    }
}
