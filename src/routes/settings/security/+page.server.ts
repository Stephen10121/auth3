import type { PublicPasskey } from '@/utils.js';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export async function load({ parent, locals }) {
    await parent();

    if (!locals.user) throw redirect(303, "/");

    let publicPasskeys: PublicPasskey[] = [];

    try {
        const passkeys = await locals.pb.collection("passkeys").getFullList({
            filter: `internal_user_id="${locals.user.id}"`
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

    return {
        publicPasskeys
    }
}

export const actions = {
    updatePassword: async ({ request, locals }) => {
        const data = Object.fromEntries(await request.formData());

        if (!data.cpassword || !data.npassword || !data.cnpassword) {
            return { error: true, success: false, message: "Missing Fields." }
        }

        if (!locals.user) {
            return { error: true, success: false, message: "Unauthorized." }
        }

        try {
            await locals.pb.collection("users").update(locals.user.id, {
                oldPassword: data.cpassword,
                password: data.npassword,
                passwordConfirm: data.cnpassword
            });
            locals.pb.authStore.clear();
        } catch (err) {
            return { error: true, success: false, message: "Unable to reset password. Try again later." }
        }

        return redirect(303, "/");
    }
} satisfies Actions;