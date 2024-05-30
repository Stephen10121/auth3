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

            //@ts-ignore
            throw error(err.status, err.message);
        }

        return {
            success: true,
            message: "Check Inbox to verify email change."
        }
    },
    updateUsername: async ({ request, locals }) => {
        const data = Object.fromEntries(await request.formData());

        if (!data.username) {
            return { error: true, success: false, message: "Missing Fields." }
        }

        if (!locals.user) {
            return { error: true, success: false, message: "Unauthorized." }
        }

        try {
            await locals.pb.collection("users").getFirstListItem(`username="${data.username}"`);
        } catch (err) {
            //@ts-ignore
            if (err.status === 404) {
                try {
                    const { username } = await locals.pb.collection("users").update(locals.user.id, { username: data.username });
                    locals.user.username = username;
                    return {
                        success: true,
                        message: "Changed Username."
                    }
                } catch (err) {
                    return { error: true, success: false, message: "Unable to change username. Try again later." }
                }
            } else {
                return { error: true, success: false, message: "Unable to change username. Try again later." }
            }
        }

        return { error: true, success: false, message: "Unable to change username. Try again later." }
    }
} satisfies Actions;