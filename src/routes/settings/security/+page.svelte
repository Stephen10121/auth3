<script lang="ts">
    import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
    import { Button } from "$lib/components/ui/button/index.js";
    import { toast } from 'svelte-sonner';

    export let data;

    async function registerButtonClick() {
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
            body: JSON.stringify(attResp),
        });

        // Wait for the results of verification
        const verificationJSON = await verificationResp.json();

        // Show UI appropriate for the `verified` status
        if (verificationJSON && verificationJSON.verified) {
            toast.success("2FA Success", {description: "Created new key!" });
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
            console.log(verificationJSON);
        } else {
            console.error(verificationJSON);
            toast.error("2FA Error", { description: "Oh no, something went wrong! Check console." });
        }
    }
</script>

{#if data.user}
    <div class="flex flex-col w-full h-full p-10">
        <h3 class="text-2xl font-medium">Security</h3>
        <Button on:click={registerButtonClick}>Register a TFA key!</Button>
        <Button on:click={startAuthenticationButton} class="mt-5">Start Auth Test</Button>
    </div>
{/if}