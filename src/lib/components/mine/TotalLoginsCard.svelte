<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
	import OpenDoor from "lucide-svelte/icons/door-open";
    import { mmddyyyy } from "@/utils.js";

	export let logins: { date: Date }[];

    let earliestLogin = "NA/NA/NANA";

    $: {
        let earliest: Date = logins.length !== 0 ? logins[0].date : new Date();
        for (let i=0;i<logins.length;i++) {
            if (logins[i].date < earliest) {
                earliest = logins[i].date;
            }
        }
        earliestLogin = mmddyyyy(earliest).join('/')
    }
</script>


<Card.Root>
    <Card.Header
        class="flex flex-row items-center justify-between space-y-0 pb-2"
    >
        <Card.Title class="text-sm font-medium">Total Logins</Card.Title>
        <OpenDoor class="h-4 w-4 text-muted-foreground" />
    </Card.Header>
    <Card.Content>
        <div class="text-2xl font-bold">{logins ? logins.length : "0"}</div>
        <p class="text-xs text-muted-foreground">First login on {earliestLogin}</p>
    </Card.Content>
</Card.Root>