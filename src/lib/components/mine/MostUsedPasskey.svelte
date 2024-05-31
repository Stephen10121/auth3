<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { type PublicPasskey } from "@/utils.js";
    import { KeyRound } from "lucide-svelte";

	export let passkeys: PublicPasskey[];

    let mostUsed = { name: "None Used", usage: 0 }

    $: {
        for (let i=0;i<passkeys.length;i++) {
            if (passkeys[i].usage >= mostUsed.usage) mostUsed = passkeys[i];
        }
    }
</script>

<a href="/settings/security">
    <Card.Root>
        <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
            <Card.Title class="text-sm font-medium">Most Used Passkey</Card.Title>
            <KeyRound class="h-4 w-4 text-muted-foreground" />
        </Card.Header>
        <Card.Content>
            <div class="text-2xl font-bold">{mostUsed.name}</div>
            <p class="text-xs text-muted-foreground">Used {mostUsed.usage} time{mostUsed.usage !==1 ? "s" : ""}</p>
        </Card.Content>
    </Card.Root>
</a>