import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
    const data = await parent();
}