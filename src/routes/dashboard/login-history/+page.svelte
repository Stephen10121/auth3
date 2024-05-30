<script lang="ts">
    import { DateFormatter, type DateValue, getLocalTimeZone } from "@internationalized/date";
    import LoginHistory from "@/components/mine/LoginHistory.svelte";
    import { Calendar } from "$lib/components/ui/calendar/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import CalendarIcon from "svelte-radix/Calendar.svelte";
    import { cn } from "$lib/utils.js";
    import type { LoginRecord } from "@/addLogin.js";

    const df = new DateFormatter("en-US", {
        dateStyle: "long"
    });

    export let data;

    let value: DateValue | undefined = undefined;
    let clearFiltersButton = false;
    let deviceTypeFilterValue: string = "";
    let mfaFilterValue = "";

    let logins = data.user.logins as LoginRecord[];

    $: {
        logins = data.user.logins.filter((loginRecord: LoginRecord) => {
            let filters: number[] = [];
            if (mfaFilterValue.length > 0) {
                let passkeyUsed = loginRecord.passkeyUsed ? loginRecord.passkeyUsed : "None Used";
                filters.push(passkeyUsed.toLowerCase().includes(mfaFilterValue.toLowerCase()) ? 1 : 0);
            }
            if (deviceTypeFilterValue.length > 0) {
                filters.push(loginRecord.deviceType.toLowerCase().includes(deviceTypeFilterValue.toLowerCase()) ? 1 : 0);
            }
            if (value) {
                const tempDate = new Date(loginRecord.date);
                filters.push((tempDate.getMonth() + 1 === value?.month && tempDate.getDate() === value.day && tempDate.getFullYear() === value.year) ? 1 : 0);
            }
            return filters.reduce((partialSum, a) => partialSum + a, 0) === filters.length;
        });
    }

    $: {
        if (value || deviceTypeFilterValue.length > 0 || mfaFilterValue.length > 0) {
            clearFiltersButton = true;
        } else {
            clearFiltersButton = false;
        }
    }
    

    function clearFilters() {
        value = undefined;
        deviceTypeFilterValue = "";
        mfaFilterValue = "";
    }
</script>

<div class="hidden flex-col md:flex px-28 mt-24 gap-3 pb-5">
    <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
            <p class="leading-7 [&:not(:first-child)]:mt-6">Filters</p>
            <Popover.Root>
                <Popover.Trigger asChild let:builder>
                    <Button
                        variant="outline"
                        class={cn("w-[240px] justify-start text-left font-normal", !value && "text-muted-foreground")}
                        builders={[builder]}
                    >
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date"}
                    </Button>
                </Popover.Trigger>
                <Popover.Content class="w-auto p-0" align="start">
                    <Calendar bind:value />
                </Popover.Content>
            </Popover.Root>
            <Input placeholder="Device/Browser Filter" class="max-w-xs" autocomplete="false" bind:value={deviceTypeFilterValue} />
            <Input placeholder="MFA Filter" class="max-w-xs" autocomplete="false" bind:value={mfaFilterValue} />
        </div>
        {#if clearFiltersButton}
            <Button on:click={clearFilters}>Clear Filters</Button>
        {/if}
    </div>
    <Card.Root class="col-span-3">
        <Card.Header>
            <Card.Title>Login History</Card.Title>
            <Card.Description>Where and when you logged in.</Card.Description>
        </Card.Header>
        <Card.Content>
            <LoginHistory loginsLog={logins} more />
        </Card.Content>
    </Card.Root>
</div>