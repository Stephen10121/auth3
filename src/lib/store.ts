import { writable } from "svelte/store";
import type { LoginRecord } from "./addLogin";

export const loginSignupValue = writable<"login" | "register">("login");
export const loginOrRegisterDiologOpen = writable(false);

export const loginHistoryMoreInfo = writable<null | LoginRecord>(null);