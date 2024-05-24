<script lang="ts">
    import type { LoginRecord } from "@/addLogin";
    import LoginHistoryItem from "./LoginHistoryItem.svelte";
    import LoginHistoryInfo from "./LoginHistoryInfo.svelte";
    import * as Table from "$lib/components/ui/table/index.js";

    export let loginsLog: LoginRecord[];
    export let more = false;

    $: newLogins = structuredClone(loginsLog).reverse();
</script>
   
<LoginHistoryInfo />

<div class="space-y-8">
    <Table.Root>
        {#if !more}
            <Table.Caption>A list of your 5 recent logins.  <a href="/dashboard/login-history" class="underline">See All</a></Table.Caption>
        {/if}
        <Table.Header>
          <Table.Row>
            <Table.Head class="w-[100px]">Service</Table.Head>
            <Table.Head>Date</Table.Head>
            <Table.Head>Method</Table.Head>
            <Table.Head class="text-right">Time</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each newLogins as log, i (log.date)}
                {#if more || i < 5}
                    <LoginHistoryItem loginRecord={log} />
                {/if}
            {/each}
        </Table.Body>
      </Table.Root>
</div>