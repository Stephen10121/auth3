export async function load({ locals }) {
    if (locals.user) {
        const user = await locals.pb.collection("users").getOne(locals.user.id);
        
        return { user, avatar: locals.pb.files.getUrl(user, user.avatar)}
    }
}