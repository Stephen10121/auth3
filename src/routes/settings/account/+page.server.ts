import type { Actions } from './$types';

export async function load({ parent }) {
    await parent();
}

export const actions = {
    updateEmail: async ({ request, locals }) => {
        const data = Object.fromEntries(await request.formData());

        if (!data.email) {
            return { error: true, success: false, message: "Email not recieved." }
        }

        if (typeof data.email !== "string") {
            return { error: true, success: false, message: "Invalid Email." }
        }

        try {
            await locals.pb.collection("users").requestEmailChange(data.email);
        } catch (err) {
            console.log(err);
        }
    }
} satisfies Actions;