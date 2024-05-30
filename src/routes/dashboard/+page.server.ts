import type { PublicPasskey } from '@/utils';
import { redirect } from '@sveltejs/kit';

export async function load({ parent, locals }) {
    const data = await parent();

    if (!data.user) {
        throw redirect(303, "/");
    }

    let publicPasskeys: PublicPasskey[] = [];

    try {
        const passkeys = await locals.pb.collection("passkeys").getFullList({
            filter: `internal_user_id="${data.user.id}"`
        });

        for (let i=0;i<passkeys.length;i++) {
            publicPasskeys.push({
                id: passkeys[i].id,
                name: passkeys[i].name,
                icon: passkeys[i].icon,
                usage: passkeys[i].usage
            });
        }
    } catch (err) {
        console.log(err);
    }

    return {...data, publicPasskeys}
}