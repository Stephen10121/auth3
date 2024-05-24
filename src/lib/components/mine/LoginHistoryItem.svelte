<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import type { LoginRecord } from "@/addLogin";
    import { loginHistoryMoreInfo } from "@/store";
    import { mmToString, mmddyyyy } from "@/utils";

    export let loginRecord: LoginRecord;

    const actualDate = new Date(loginRecord.date);
    const date = mmddyyyy(actualDate);
</script>

<Table.Row on:click={() => {loginHistoryMoreInfo.set(loginRecord)}}>
    <Table.Cell class="font-medium">{loginRecord.service}</Table.Cell>
    <Table.Cell>{mmToString(date[0])} {date[1]}, {date[2]}</Table.Cell>
    <Table.Cell>Computer</Table.Cell>
    <Table.Cell class="text-right">{actualDate.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</Table.Cell>
</Table.Row>

<!-- <div class="flex items-center">
    <Avatar.Root class="h-9 w-9">
        <Avatar.Image src={avatar} alt="Avatar" />
        <Avatar.Fallback>OM</Avatar.Fallback>
    </Avatar.Root>
    <div class="ml-4 space-y-1">
        <button on:click={() => {loginHistoryMoreInfo.set(loginRecord)}} class="text-sm font-medium leading-none underline cursor-pointer">{loginRecord.service}</button>
        <p class="text-sm text-muted-foreground">
            {mmToString(date[0])} {date[1]}, {date[2]}
        </p>
    </div>
    <div class="ml-auto font-medium">{actualDate.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</div>
</div> -->