<script lang="ts">
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import { loginHistoryMoreInfo } from "@/store";
    import { mmToString, mmddyyyy } from "@/utils";
    import { onDestroy } from "svelte";
    import type { LoginRecord } from "@/addLogin";

    let actualDate: Date;
    let date: (string | number)[];

    $: {
        if ($loginHistoryMoreInfo !== null) {
            actualDate = new Date($loginHistoryMoreInfo.date);
            date = mmddyyyy(actualDate)
        }
    }

    let info: LoginRecord | null = null;
    const loginHistoryMoreInfoUnsub = loginHistoryMoreInfo.subscribe((data) => info = data);

    onDestroy(() => {
        loginHistoryMoreInfoUnsub();
    });
</script>
   
<Sheet.Root open={info !== null} onOpenChange={() => {loginHistoryMoreInfo.set(null)}}>
    <Sheet.Content side="right">
        <Sheet.Header>
            <Sheet.Title>{info?.service} @{actualDate.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</Sheet.Title>
            <Sheet.Description>More information about the login record.</Sheet.Description>
        </Sheet.Header>
        {#if info}
            <div class="grid gap-4 py-4">
                <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Device Info</h4>
                <div class="w-full ml-4">
                    <p><span class="font-bold">Form Factor</span>: {info.deviceInfo.form_factor}</p>
                    <p><span class="font-bold">Device Name</span>: {info.deviceInfo.complete_device_name}</p>
                    <p><span class="font-bold">Is Mobile</span>: {info.deviceInfo.is_mobile ? "Yes" : "No"}</p>
                    <p><span class="font-bold">Ip Address</span>: {info.ip}</p>
                    <p><span class="font-bold">User Agent</span>: {info.userAgent}</p>
                </div>
                <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">More Info</h4>
                <div class="w-full ml-4">
                    <p><span class="font-bold">Service</span>: {info.service}</p>
                    <p><span class="font-bold">Time</span>: {actualDate.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</p>
                    <p><span class="font-bold">Date</span>: {mmToString(date[0])} {date[1]}, {date[2]}</p>
                </div>
            </div>
        {/if}
    </Sheet.Content>
</Sheet.Root>