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
    <Table.Cell>{loginRecord.deviceType}</Table.Cell>
    <Table.Cell class="text-right">{actualDate.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</Table.Cell>
</Table.Row>