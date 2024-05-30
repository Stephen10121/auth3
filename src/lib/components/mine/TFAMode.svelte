<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card/index.js";
    import { toast } from "svelte-sonner";
    import Loading from "./Loading.svelte";
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>2 Factor Authentication</Card.Title>
        <Card.Description>You have 2 factor authentication enabled.</Card.Description>
    </Card.Header>
    <div>
        <Card.Content class="space-y-2">
            <Loading />
        </Card.Content>
        <Card.Footer>
            <Button type="submit">Cancel</Button>
        </Card.Footer>
    </div>
</Card.Root>