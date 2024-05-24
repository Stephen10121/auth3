export function load({ locals }) {
    if (locals.user) {
        return {
            user: locals.user,
            avatar: locals.pb.files.getUrl(locals.user, locals.user.avatar)
        }
    }
}