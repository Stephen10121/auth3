<script lang="ts">
    import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
    import { toast } from 'svelte-sonner';
    import {
    Button,
    buttonVariants
  } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
    import { Fingerprint, Key, KeyRound, LockKeyhole, ScanFace } from 'lucide-svelte';
    import { invalidateAll } from '$app/navigation';
    import * as Card from "$lib/components/ui/card/index.js";
    import SecurityKeys from '@/components/mine/SecurityKeys.svelte';
    import { Switch } from "$lib/components/ui/switch/index.js";

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

    async function startAuthenticationButton() {
        // GET authentication options from the endpoint that calls
        // @simplewebauthn/server -> generateAuthenticationOptions()
        const resp = await fetch('/tfa/generateAuthenticationOptions');
        const respJSON = await resp.json()
        console.log(respJSON);

        let asseResp;
        try {
            // Pass the options to the authenticator and wait for a response
            asseResp = await startAuthentication(respJSON);
        } catch (error) {
            console.error(error);
            // Some basic error handling
            toast.error("2FA Error", { description: "Oh no, something went wrong! Check console." });
            throw error;
        }

        // POST the response to the endpoint that calls
        // @simplewebauthn/server -> verifyAuthenticationResponse()
        const verificationResp = await fetch('/tfa/verifyAuthentication', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(asseResp),
        });

        // Wait for the results of verification
        const verificationJSON = await verificationResp.json();

        // Show UI appropriate for the `verified` status
        if (verificationJSON && verificationJSON.verified) {
            toast.success("2FA Success");
            invalidateAll();
        } else {
            console.error(verificationJSON);
            toast.error("2FA Error", { description: "Oh no, something went wrong! Check console." });
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
            toast.success("Success", {description: `2FA was ${enable ? "Enabled" : "Disabled"}!` });
        } else {
            toast.error("Error", { description: "Couldn't change 2FA status. Try reloading the page." });
            console.error(verificationJSON);
        }
        invalidateAll();
    }

    $: {
        if (tfaEnabled !== data.user?.tfa) {
            tfaChange(tfaEnabled);
        }
    }
</script>

{#if data.user}
    <div class="flex flex-col w-full h-full p-10">
        <h3 class="text-2xl font-medium">Security</h3>
        <div class="w-full h-full px-5">
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mt-7">2 Factor Authentication</h4>
            <div class="flex items-center space-x-2 mt-5">
                <Switch bind:checked={tfaEnabled} id="tfa-enabled" />
                <Label for="tfa-enabled">Enable 2FA</Label>
            </div>
            <Card.Root class="col-span-3 mt-5 {tfaEnabled ? "" : "opacity-50 pointer-events-none"}">
                <Card.Header>
                    <Card.Title>Passkeys</Card.Title>
                    <Card.Description>Your 2 factor authentication keys.</Card.Description>
                </Card.Header>
                <Card.Content>
                    <SecurityKeys publicKeys={data.publicPasskeys} {tfaEnabled} />
                </Card.Content>
            </Card.Root>
            <Dialog.Root bind:open={registerDialogOpen}>
                <Dialog.Trigger class="{buttonVariants({ variant: 'default' })} mt-5" disabled={!tfaEnabled}>Register a new 2FA key!</Dialog.Trigger>
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
            <Button on:click={startAuthenticationButton} class="mt-5" disabled={!tfaEnabled}>Test Key</Button>
        </div>
    </div>
{/if}