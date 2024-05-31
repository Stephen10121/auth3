<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import type { PublicAuthClient } from "@/utils";
    import { Button } from "$lib/components/ui/button/index.js";
    import { ShieldCheck } from 'lucide-svelte';

    export let authClients: PublicAuthClient[];
</script>

<div class="space-y-8">
    {#if authClients.length > 0}
        {#each authClients as client (client.id)}
            <div class="flex items-center">
                <Avatar.Root class="h-9 w-9">
                        <ShieldCheck class="mx-auto my-auto size-5" aria-hidden="true" />
                </Avatar.Root>
                <div class="ml-4 space-y-1">
                    <p class="text-sm font-medium leading-none">{client.name}</p>
                </div>
                <Button class="ml-auto font-medium" variant="secondary" href="/settings/developer/authClient/{client.id}">View</Button>
            </div>
        {/each}
    {/if}
</div>