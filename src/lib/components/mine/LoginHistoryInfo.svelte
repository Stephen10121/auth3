<script lang="ts">
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { loginHistoryMoreInfo } from "@/store";
    import { mmddyyyy } from "@/utils";

    let actualDate: Date;
    let date: (string | number)[];

    $: {
        if ($loginHistoryMoreInfo !== null) {
            actualDate = new Date($loginHistoryMoreInfo.date);
            date = mmddyyyy(actualDate)
        }
    }
</script>
   

<Sheet.Root open={$loginHistoryMoreInfo !== null} onOpenChange={() => {loginHistoryMoreInfo.set(null)}}>
    <Sheet.Content side="right">
        <Sheet.Header>
            <Sheet.Title>{$loginHistoryMoreInfo?.service} @{actualDate.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</Sheet.Title>
            <Sheet.Description>Info about the login record.</Sheet.Description>
        </Sheet.Header>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right">Name</Label>
            <Input id="name" value="Pedro Duarte" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
            <Label for="username" class="text-right">Username</Label>
            <Input id="username" value="@peduarte" class="col-span-3" />
            </div>
        </div>
        <Sheet.Footer>
            <Sheet.Close asChild let:builder>
                <Button builders={[builder]} type="submit">Save changes</Button>
            </Sheet.Close>
        </Sheet.Footer>
    </Sheet.Content>
</Sheet.Root>