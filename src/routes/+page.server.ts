import type { ClientResponseError, RecordAuthResponse, RecordModel } from 'pocketbase';
import type { Actions } from './$types';
import { addLogin } from '@/addLogin';

export const actions = {
    register: async ({ locals, request }): Promise<({error: false, success: boolean, message: string} | {error: true, message: string})> => {
        const body = Object.fromEntries(await request.formData());

        if (!body.name || !body.email || !body.username || !body.password || !body.passwordConfirm) {
            return { error: true, message: "Missing Fields!" }
        }

        if (body.password !== body.passwordConfirm) {
            return { error: true, message: "Passwords don't match!" }
        }

        try {
            await locals.pb.collection('users').create({ emailVisibility: true, ...body });
        } catch (err) {
            let error = err as any as ClientResponseError;
            let errorList = Object.keys(error.response.data);
            if (errorList.length === 0) {
                return { error: true, message: "Failed to create user." }
            }
            return { error: true, message: error.response.data[errorList[0]].message }
        }

        return { error: false, success: true, message: "User was created!" }
    },
    login: async({ request, locals, getClientAddress }): Promise<({error: false, success: boolean, message: string} | {error: true, message: string})> => {
        const body = Object.fromEntries(await request.formData());

        if (!body.username || !body.password) {
            return { error: true, message: "Missing Fields!" }
        }

        let user: RecordAuthResponse<RecordModel>;

        try {
            user = await locals.pb.collection("users").authWithPassword(body.username as string, body.password as string);
        } catch (err) {
            let error = err as any as ClientResponseError;
            let errorList = Object.keys(error.response.data);
            if (errorList.length === 0) {
                return { error: true, message: "Failed to login user." }
            }
            return { error: true, message: error.response.data[errorList[0]].message }
        }
        
        console.log(request.headers.get("user-agent"));
        await addLogin(user.record, locals, getClientAddress(), "GAuth", "Computer");

        return { error: false, success: true, message: "Logged in user!" }
    }
} satisfies Actions;