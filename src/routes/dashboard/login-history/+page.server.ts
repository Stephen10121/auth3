import { redirect } from "@sveltejs/kit";

export async function load({ parent }) {
    const data = await parent();
    if (!data.user) {
        throw redirect(303, "/");
    }

    return {...data}
}