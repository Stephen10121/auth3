<script lang="ts">
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import AuthClients from "@/components/mine/AuthClients.svelte";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as Drawer from "$lib/components/ui/drawer/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import * as Card from "$lib/components/ui/card/index.js";

    export let data;
</script>

{#if data.user}
    <div class="flex flex-col w-full h-full p-10">
        <h3 class="text-2xl font-medium">Developer Settings</h3>
        <div class="w-full h-full px-5">
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mt-7">Auth Clients</h4>
            <p class="leading-6 text-sm mt-3">Our platform features a secure password update option for users.</p>
            <Card.Root class="col-span-3 mt-5">
                <Card.Header>
                    <Card.Title>Current Auth Clients</Card.Title>
                    <Card.Description>These are the ones you've registered with us. Feel free to edit the information.</Card.Description>
                </Card.Header>
                <Card.Content>
                    <AuthClients authClients={data.authClients} />
                </Card.Content>
            </Card.Root>
            <Drawer.Root>
                <Drawer.Trigger asChild let:builder>
                    <Button builders={[builder]} class="mt-5">Create an Auth Client</Button>
                </Drawer.Trigger>
                <Drawer.Content>
                    <div class="mx-auto w-full max-w-sm">
                        <div class="flex flex-col items-start w-full">
                            <Drawer.Header>
                                <Drawer.Title>New Auth Client</Drawer.Title>
                                <Drawer.Description>If your app is in developement, we support localhost.</Drawer.Description>
                            </Drawer.Header>
                            <div class="grid gap-10 py-4 w-full">
                                <div class="space-y-1 w-full">
                                    <Label for="name">Name</Label>
                                    <Input id="name" placeholder="e.g. 'Drive Auth'" autocomplete="off" class="w-full" />
                                </div>
                                <div class="grid w-full gap-1.5">
                                    <Label for="authorized_origins">Authorized Origins</Label>
                                    <Textarea id="authorized_origins" placeholder="Separate each domain with a comma. e.g. 'http://localhost,https://auth.drive.com'" class="min-h-20" />
                                </div>
                                <div class="grid w-full gap-1.5">
                                    <Label for="authorized_redirects">Authorized Redirect URLs</Label>
                                    <Textarea id="authorized_redirects" placeholder="Separate each domain with a comma. e.g. 'http://localhost/authRedirect,https://auth.drive.com/authRedirect'" class="min-h-20" />
                                </div>
                            </div>
                            <Drawer.Footer>
                                <div class="flex">
                                    <Drawer.Close asChild let:builder>
                                        <Button builders={[builder]} variant="outline">Cancel</Button>
                                    </Drawer.Close>
                                    <Button>Create Passkey</Button>
                                </div>
                            </Drawer.Footer>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Root>
            <!-- <Dialog.Root>
                <Dialog.Trigger class="{buttonVariants({ variant: 'default' })} mt-5">Create a Auth Client</Dialog.Trigger>
                <Dialog.Content class="sm:max-w-[425px]">
                    <Dialog.Header>
                        <Dialog.Title>New Auth Client</Dialog.Title>
                        <Dialog.Description>If your app is in developement, we support localhost</Dialog.Description>
                    </Dialog.Header>
                    <div class="grid gap-4 py-4">
                        <div class="space-y-1">
                            <Label for="name">Name</Label>
                            <Input id="name" placeholder="e.g. 'Drive Auth'" autocomplete="off" />
                        </div>
                        <div class="grid w-full gap-1.5">
                            <Label for="authorized_origins">Authorized Origins</Label>
                            <Textarea id="authorized_origins" placeholder="Separate each domain with a comma. e.g. 'http://localhost,https://auth.drive.com'" />
                        </div>
                        <div class="grid w-full gap-1.5">
                            <Label for="authorized_redirects">Authorized Redirect URLs</Label>
                            <Textarea id="authorized_redirects" placeholder="Separate each domain with a comma. e.g. 'http://localhost/authRedirect,https://auth.drive.com/authRedirect'" />
                        </div>
                    </div>
                    <Dialog.Footer>
                        <Button>Create Passkey</Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Root> -->
        </div>
    </div>
{/if}