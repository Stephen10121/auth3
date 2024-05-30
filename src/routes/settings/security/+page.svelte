<script lang="ts">
    import { Fingerprint, Key, KeyRound, Keyboard, LockKeyhole, Nfc, ScanFace } from 'lucide-svelte';
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import SecurityKeys from '@/components/mine/SecurityKeys.svelte';
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { startRegistration } from '@simplewebauthn/browser';
    import { Switch } from "$lib/components/ui/switch/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { invalidateAll } from '$app/navigation';
    import { toast } from 'svelte-sonner';
    import { enhance } from '$app/forms';

    export let data;

    let newKeyName = "";
    let newKeyIcon = "";
    let registerDialogOpen = false;
    let tfaEnabled = data.user?.tfa;

    async function registerButtonClick() {
        if (newKeyIcon.length === 0 || newKeyIcon.length === 0) {
            toast.error("2FA Error", { description: "Empty Fields." });
            return;
        }

        // GET registration options from the endpoint that calls
        // @simplewebauthn/server -> generateRegistrationOptions()
        const resp = await fetch('/tfa/generateRegistrationOptions');

        let attResp;
        try {
            // Pass the options to the authenticator and wait for a response
            attResp = await startRegistration(await resp.json());
        } catch (error) {
            console.error(error);
            //@ts-ignore
            if (error.name === 'InvalidStateError') {
                toast.error("2FA Error", { description: 'Authenticator was probably already registered by user' });
            } else {
                toast.error("2FA Error", { description: "Oh no, something went wrong! Check console." });
            }
            return;
        }

        // POST the response to the endpoint that calls
        // @simplewebauthn/server -> verifyRegistrationResponse()
        const verificationResp = await fetch('/tfa/verifyRegistration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...attResp, newKeyIcon, newKeyName }),
        });

        // Wait for the results of verification
        const verificationJSON = await verificationResp.json();

        // Show UI appropriate for the `verified` status
        if (verificationJSON && verificationJSON.verified) {
            toast.success("2FA Success", {description: "Created new key!" });
            invalidateAll();
            registerDialogOpen = false;
        } else {
            toast.error("2FA Error", { description: "Oh no, something went wrong! Check console." });
            console.error(verificationJSON);
        }
    }

    async function tfaChange(enable: boolean) {
        const verificationResp = await fetch('/tfa/setTfa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ enable: enable ? "1" : "0" }),
        });

        const verificationJSON = await verificationResp.json();
        if (verificationJSON && verificationJSON.ok) {
            toast.success("Success", {description: `MFA was ${enable ? "Enabled" : "Disabled"}!` });
        } else {
            toast.error("Error", { description: "Couldn't change MFA status. Try reloading the page." });
            console.error(verificationJSON);
        }
        invalidateAll();
    }

    $: {
        if (tfaEnabled !== data.user?.tfa) {
            tfaChange(tfaEnabled);
        }
    }

    export let form;

    $: {
        if (form) {
            if (form.error) {
                toast.error("Error", { description: form.message});
            } else if (form.success) {
                toast.success("Success", {description: form.message});
            }
        }
    }
</script>

{#if data.user}
    <div class="flex flex-col w-full h-full p-10">
        <h3 class="text-2xl font-medium">Security</h3>
        <div class="w-full h-full px-5">
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mt-7">Password</h4>
            <p class="leading-6 text-sm mt-3">Our platform features a secure password update option for users.</p>
            <Dialog.Root>
                <Dialog.Trigger class="{buttonVariants({ variant: "outline" })} w-fit mt-5">Change Password</Dialog.Trigger>
                <Dialog.Content class="sm:max-w-[425px]">
                    <Dialog.Header>
                        <Dialog.Title>Change Password</Dialog.Title>
                        <Dialog.Description>Make changes to your password here. Click Update Password when you're done.</Dialog.Description>
                    </Dialog.Header>
                        <form action="?/updatePassword" method="POST" class="grid gap-4 py-4" use:enhance>
                            <div class="space-y-1">
                                <Label for="cpassword">Current Password</Label>
                                <Input id="cpassword" name="cpassword" type="password" class="col-span-3" required />
                            </div>
                            <div class="space-y-1">
                                <Label for="npassword">New Password</Label>
                                <Input id="npassword" name="npassword" type="password" class="col-span-3" autocomplete="off" required />
                            </div>
                            <div class="space-y-1">
                                <Label for="cnpassword">Confirm New Password</Label>
                                <Input id="cnpassword" name="cnpassword" type="password" class="col-span-3" autocomplete="off" required />
                            </div>
                            <a href="/reset-password" class="underline">I forgot my password</a>
                            <div class="w-full flex justify-end -mb-5 mt-5">
                                <Button type="submit" class="w-fit">Update Password</Button>
                            </div>
                        </form>
                    </Dialog.Content>
            </Dialog.Root>
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mt-7">MFA - Multi Factor Authentication</h4>
            <p class="leading-6 text-sm mt-3">If you enable this and you didn't register any keys, when you login, MFA will still be disabled because you don't have any MFA passkeys registered.</p>
            <div class="flex items-center space-x-2 mt-5">
                <Switch bind:checked={tfaEnabled} id="tfa-enabled" />
                <Label for="tfa-enabled" class="relative w-fit">Enable MFA</Label>
            </div>
            <Card.Root class="col-span-3 mt-5 {tfaEnabled ? "" : "opacity-50 pointer-events-none"}">
                <Card.Header>
                    <Card.Title>Passkeys</Card.Title>
                    <Card.Description>Your multi factor authentication keys.</Card.Description>
                </Card.Header>
                <Card.Content>
                    <SecurityKeys publicKeys={data.publicPasskeys} {tfaEnabled} />
                </Card.Content>
            </Card.Root>
            <Dialog.Root bind:open={registerDialogOpen}>
                <Dialog.Trigger class="{buttonVariants({ variant: 'default' })} mt-5" disabled={!tfaEnabled}>Register a new MFA key!</Dialog.Trigger>
                <Dialog.Content class="sm:max-w-[425px]">
                    <Dialog.Header>
                        <Dialog.Title>New Passkey</Dialog.Title>
                        <Dialog.Description>We support fingerprints, security keys, windows hello, etc.</Dialog.Description>
                    </Dialog.Header>
                    <div class="grid gap-4 py-4">
                        <div class="space-y-1">
                            <Label for="name">Passkey Name</Label>
                            <Input id="name" placeholder="e.g. 'Macbook Fingerprint.'" bind:value={newKeyName} autocomplete="off" />
                        </div>
                        <div class="space-y-1">
                            <Label for="icon">Icon</Label>
                            <Select.Root>
                                <Select.Trigger>
                                    <Select.Value placeholder="Select an icon" />
                                </Select.Trigger>
                                <Select.Content>
                                    <Select.Group>
                                        <Select.Label>Icons</Select.Label>
                                        <Select.Item on:click={() => {newKeyIcon="fingerprint"}} value='fingerprint' label="Fingerprint">
                                            <Fingerprint class="mr-2 size-4" aria-hidden="true" />
                                            Fingerprint
                                        </Select.Item>
                                        <Select.Item on:click={() => {newKeyIcon="roundkey"}} value='roundkey' label="Round Key">
                                            <KeyRound class="mr-2 size-4" aria-hidden="true" />
                                            Round Key
                                        </Select.Item>
                                        <Select.Item on:click={() => {newKeyIcon="key"}} value='key' label="Key">
                                            <Key class="mr-2 size-4" aria-hidden="true" />
                                            Key
                                        </Select.Item>
                                        <Select.Item on:click={() => {newKeyIcon="lock"}} value='lock' label="Lock">
                                            <LockKeyhole class="mr-2 size-4" aria-hidden="true" />
                                            Lock
                                        </Select.Item>
                                        <Select.Item on:click={() => {newKeyIcon="face"}} value='face' label="Face">
                                            <ScanFace class="mr-2 size-4" aria-hidden="true" />
                                            Face
                                        </Select.Item>
                                        <Select.Item on:click={() => {newKeyIcon="nfc"}} value='nfc' label="NFC">
                                            <Nfc class="mr-2 size-4" aria-hidden="true" />
                                            NFC
                                        </Select.Item>
                                        <Select.Item on:click={() => {newKeyIcon="pin"}} value='pin' label="Pin">
                                            <Keyboard class="mr-2 size-4" aria-hidden="true" />
                                            Pin
                                        </Select.Item>
                                    </Select.Group>
                                </Select.Content>
                                <Select.Input name="icon" />
                            </Select.Root>
                        </div>
                    </div>
                    <Dialog.Footer>
                        <Button on:click={registerButtonClick}>Create Passkey</Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Root>
        </div>
    </div>
{/if}