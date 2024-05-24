<script lang="ts">
	import Activity from "lucide-svelte/icons/activity";
	import CreditCard from "lucide-svelte/icons/credit-card";
	import OpenDoor from "lucide-svelte/icons/door-open";
	import Download from "lucide-svelte/icons/download";
	import Users from "lucide-svelte/icons/users";
	import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
    import LoginHistory from "@/components/mine/LoginHistory.svelte";
    import { mmddyyyy } from "@/utils.js";

	export let data;
</script>

<div class="hidden flex-col md:flex px-28 mt-24">
    <Card.Root class="col-span-3">
        <Card.Header>
            <Card.Title>Login History</Card.Title>
            <Card.Description>Where and when you logged in.</Card.Description>
        </Card.Header>
        <Card.Content>
            <LoginHistory loginsLog={data.user.logins} more />
        </Card.Content>
    </Card.Root>
</div>