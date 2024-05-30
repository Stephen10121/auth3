import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
    resetPassword: async ({ request, locals }) => {
        const data = Object.fromEntries(await request.formData());

        if (!data.email) {
            return { error: true, success: false, message: "Missing Fields." }
        }

        try {
            await locals.pb.collection("users").requestPasswordReset(data.email as string)
            
            return {
                success: true,
                message: "Check your email for a password change form."
            }
        } catch (err) {
            return { error: true, success: false, message: "Unable to reset password. Try again later." }
        }
    }
} satisfies Actions;