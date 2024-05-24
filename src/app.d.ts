// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
type AuthModel = {
    [key: string]: any;
} | null;
import PocketBase from "pocketbase";
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: PocketBase
			user?: AuthModel
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
