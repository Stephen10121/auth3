<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { Button } from "$lib/components/ui/button";
    import Loading from "./Loading.svelte";

    export let tfaMode: boolean;
    export let tfaSomethingWentWrong: boolean;
    export let restartTfa: () => any;
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Multi Factor Authentication</Card.Title>
        <Card.Description>You have multi factor authentication enabled.</Card.Description>
    </Card.Header>
    <div>
        <Card.Content class="space-y-2">
            <Loading />
        </Card.Content>
        <Card.Footer>
            <Button type="submit" variant="outline" on:click={() => {tfaMode = false}}>Cancel</Button>
            {#if tfaSomethingWentWrong}
                <Button type="submit" class="ml-3" on:click={() => {restartTfa();tfaSomethingWentWrong = false}}>Try Again</Button>
            {/if}
        </Card.Footer>
    </div>
</Card.Root>