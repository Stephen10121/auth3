<script lang="ts">
    import {
        Button,
        buttonVariants
    } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";

    export let data;
</script>

{#if data.user}
    <div class="flex flex-col w-full h-full p-10">
        <h3 class="text-2xl font-medium">Account</h3>
        <div class="w-full h-full px-5">
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mt-7">Email</h4>
            <p class="leading-6 text-sm mt-3">Our system includes a feature that allows users to update their registered email address securely.</p>
            <Dialog.Root>
                <Dialog.Trigger class="{buttonVariants({ variant: "outline" })} w-fit mt-5">Change Email</Dialog.Trigger>
                <Dialog.Content class="sm:max-w-[425px]">
                    <Dialog.Header>
                        <Dialog.Title>Change Email</Dialog.Title>
                        <Dialog.Description>Make changes to your email here. Click save when you're done.</Dialog.Description>
                    </Dialog.Header>
                        <form action="?/updateEmail" method="POST" class="grid gap-4 py-4">
                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="email" class="text-right">New Email</Label>
                                <Input id="email" name="email" type="email" class="col-span-3" />
                            </div>
                            <div class="w-full flex justify-end -mb-5 mt-5">
                                <Button type="submit" class="w-fit">Update Email</Button>
                            </div>
                        </form>
                    </Dialog.Content>
            </Dialog.Root>
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mt-7">Password</h4>
            <p class="leading-6 text-sm mt-3">Our platform features a secure password update option for users.</p>
            <Dialog.Root>
                <Dialog.Trigger class="{buttonVariants({ variant: "outline" })} w-fit mt-5">Change Password</Dialog.Trigger>
                <Dialog.Content class="sm:max-w-[425px]">
                    <Dialog.Header>
                        <Dialog.Title>Change Password</Dialog.Title>
                        <Dialog.Description>Make changes to your password here. Click save when you're done.</Dialog.Description>
                    </Dialog.Header>
                        <form action="?/updateEmail" method="POST" class="grid gap-4 py-4">
                            <div class="space-y-1">
                                <Label for="cpassword">Current Password</Label>
                                <Input id="cpassword" name="cpassword" type="password" class="col-span-3" />
                            </div>
                            <div class="space-y-1">
                                <Label for="npassword">New Password</Label>
                                <Input id="npassword" name="npassword" type="password" class="col-span-3" autocomplete="off" />
                            </div>
                            <div class="w-full flex justify-end -mb-5 mt-5">
                                <Button type="submit" class="w-fit">Update Password</Button>
                            </div>
                        </form>
                    </Dialog.Content>
            </Dialog.Root>
        </div>
    </div>
{/if}