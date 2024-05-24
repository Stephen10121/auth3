import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
    if (!locals.user) {
        throw redirect(303, "/");
    }

    return { user: locals.user, avatar: locals.pb.files.getUrl(locals.user, locals.user.avatar)}
}