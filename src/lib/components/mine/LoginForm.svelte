<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
</script>

<div class="grid gap-4 py-4">
    <div class="grid grid-cols-4 items-center gap-4">
        <Label for="email" class="text-right">Email</Label>
        <Input id="email" class="col-span-3" type="email" />
    </div>
    <div class="grid grid-cols-4 items-center gap-4">
        <Label for="password" class="text-right">Password</Label>
        <Input id="password" type="password" class="col-span-3" />
    </div>
</div>

<Dialog.Footer>
    <Button type="submit">Login</Button>
</Dialog.Footer>