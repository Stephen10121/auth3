import { redirect } from "@sveltejs/kit";

export async function load({ params, parent, locals }) {
    await parent();

    if (!locals.user) throw redirect(303, "/");

    try {
        const authClient = await locals.pb.collection("authClient").getOne(params.slug, {
            filter: `owner="${locals.user.id}"`
        });

        return {
            authClient
        }
    } catch (err) {
        console.log(err);
        return redirect(303, "/settings/developer");
    }
}