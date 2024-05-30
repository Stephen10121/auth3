<script lang="ts">
    import type { PublicPasskey } from "@/utils";
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { Fingerprint, Key, KeyRound, LockKeyhole, ScanFace } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button/index.js";
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
    import { toast } from "svelte-sonner";
    import { invalidateAll } from "$app/navigation";

    export let publicKeys: PublicPasskey[];
    export let tfaEnabled: boolean;

    async function deleteKey(id: string, name: string) {
        if (!tfaEnabled) return;
        const verificationResp = await fetch('/tfa/deleteKey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });

        const verificationJSON = await verificationResp.json();
        if (verificationJSON && verificationJSON.ok) {
            toast.success("Success", {description: `"${name}" was removed.` });
        } else {
            toast.error("Error", { description: "Couldn't delete key. Try reloading the page." });
            console.error(verificationJSON);
        }
        invalidateAll();
    }
</script>

<div class="space-y-8">
    {#each publicKeys as key (key.id)}
        <div class="flex items-center">
            <Avatar.Root class="h-9 w-9">
                {#if key.icon === "fingerprint"}
                    <Fingerprint class="mx-auto my-auto size-5" aria-hidden="true" />
                {:else if key.icon === "face"}
                    <ScanFace class="mx-auto my-auto size-5" aria-hidden="true" />
                {:else if key.icon === "key"}
                    <Key class="mx-auto my-auto size-5" aria-hidden="true" />
                {:else if key.icon === "lock"}
                    <LockKeyhole class="mx-auto my-auto size-5" aria-hidden="true" />
                {:else}
                    <KeyRound class="mx-auto my-auto size-5" aria-hidden="true" />
                {/if}
                <!-- <Avatar.Image src="/avatars/01.png" alt="Avatar" />
                <Avatar.Fallback>OM</Avatar.Fallback> -->
            </Avatar.Root>
            <div class="ml-4 space-y-1">
                <p class="text-sm font-medium leading-none">{key.name}</p>
                <p class="text-sm text-muted-foreground">Used {key.usage} time{key.usage === 1 ? "" : "s"}.</p>
            </div>
            <AlertDialog.Root>
                <AlertDialog.Trigger asChild let:builder>
                    <Button builders={[builder]} class="ml-auto font-medium" variant="destructive">Delete</Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content>
                    <AlertDialog.Header>
                        <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                        <AlertDialog.Description>
                            This action cannot be undone. This will permanently delete "{key.name}"
                            and you wont be able to use it to login to your account.
                        </AlertDialog.Description>
                    </AlertDialog.Header>
                    <AlertDialog.Footer>
                        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                        <AlertDialog.Action on:click={() => deleteKey(key.id, key.name)}>Continue</AlertDialog.Action>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog.Root>
            <!-- <Button class="ml-auto font-medium">Delete</Button> -->
        </div>
    {/each}
</div>