<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import {
        Button,
        buttonVariants
    } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { toast } from "svelte-sonner";

    export let data;
    export let form;

    $: {
        if (form) {
            if (form.error) {
                toast.error("Error", { description: form.message});
            } else if (form.success) {
                toast.success("Success", {description: form.message});
            }
        }
    }
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
                        <Dialog.Description>Make changes to your email here. Click Update Email when you're done.</Dialog.Description>
                    </Dialog.Header>
                        <form action="?/updateEmail" method="POST" class="grid gap-4 py-4" use:enhance={() => {
                            return async ({ update }) => {
                              update({ reset: false });
                            };
                          }}>
                            <div class="grid grid-cols-4 items-center gap-4">
                                <Label for="email" class="text-right">New Email</Label>
                                <Input id="email" name="email" type="email" class="col-span-3" required />
                            </div>
                            <div class="w-full flex justify-end -mb-5 mt-5">
                                <Button type="submit" class="w-fit">Update Email</Button>
                            </div>
                        </form>
                    </Dialog.Content>
            </Dialog.Root>
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mt-7">Username</h4>
            <p class="leading-6 text-sm mt-3">Don't like your username? Just pick a new one!</p>
            <Input type="text" value={data.user.username} class="mt-3 w-fit" disabled />
            <Dialog.Root>
                <Dialog.Trigger class="{buttonVariants({ variant: "outline" })} w-fit mt-5">Change Username</Dialog.Trigger>
                <Dialog.Content class="sm:max-w-[425px]">
                    <Dialog.Header>
                        <Dialog.Title>Change Username</Dialog.Title>
                        <Dialog.Description>Make changes to your username here. Click Update Username when you're done.</Dialog.Description>
                    </Dialog.Header>
                        <form action="?/updateUsername" method="POST" class="grid gap-4 py-4" use:enhance={() => {
                            return async ({ update }) => {
                              update({ reset: false });
                            };
                          }}>
                            <div class="space-y-1">
                                <Label for="username" class="text-right">New Username</Label>
                                <Input id="username" name="username" type="text" class="col-span-3" required />
                            </div>
                            <div class="w-full flex justify-end -mb-5 mt-5">
                                <Button type="submit" class="w-fit">Update Username</Button>
                            </div>
                        </form>
                    </Dialog.Content>
            </Dialog.Root>
        </div>
    </div>
{/if}