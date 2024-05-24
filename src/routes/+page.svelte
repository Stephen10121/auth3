<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import Floaters from "@/components/mine/Floaters.svelte";
   
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { loginOrRegisterDiologOpen, loginSignupValue } from "@/store";
    import { toast } from "svelte-sonner";
    import { enhance } from '$app/forms';
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    export let form;

    $: {
        if (form) {
            if (form.error) {
                toast.error("Form Error", { description: form.message});
            } else if (form.success) {
                toast.success("Success", {description: form.message});

                if (form.message === "Logged in user!") {
                    goto('/dashboard');
                }
            }
        }
    }

    let wurfl = "";

    onMount(() => {
        setTimeout(() => {
            //@ts-ignore
            if (WURFL) {
                //@ts-ignore
                wurfl = JSON.stringify(WURFL) as string;
            }
        }, 50);
    });
</script>

<svelte:head>
    <script src="https://wurfl.io/wurfl.js"></script>
</svelte:head>

<Dialog.Root bind:open={$loginOrRegisterDiologOpen}>
    <Dialog.Content class="sm:max-w-[425px] pt-10">
        <Tabs.Root value={$loginSignupValue}>
            <Tabs.List class="grid w-full grid-cols-2">
                <Tabs.Trigger value="login">Login</Tabs.Trigger>
                <Tabs.Trigger value="register">Register</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="login">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Login</Card.Title>
                        <Card.Description>Welcome back! 😊</Card.Description>
                    </Card.Header>
                    <form action="?/login" method="POST" use:enhance={() => {
                        return async ({ update }) => {
                          update({ reset: false });
                        };
                      }}>
                      <input type="hidden" name="wurfl" bind:value={wurfl}>
                        <Card.Content class="space-y-2">
                            <div class="space-y-1">
                                <Label for="username">Username</Label>
                                <Input id="username" name="username" />
                            </div>
                            <div class="space-y-1">
                                <Label for="password">Password</Label>
                                <Input id="password" name="password" type="password" />
                            </div>
                        </Card.Content>
                        <Card.Footer>
                            <Button type="submit">Login</Button>
                        </Card.Footer>
                    </form>
                </Card.Root>
            </Tabs.Content>
            <Tabs.Content value="register">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Register</Card.Title>
                        <Card.Description>Let's get you started!</Card.Description>
                    </Card.Header>
                    <form action="?/register" method="POST" use:enhance={() => {
                        return async ({ update }) => {
                          update({ reset: false });
                        };
                      }}>
                        <Card.Content class="space-y-2">
                            <div class="space-y-1">
                                <Label for="name">Name</Label>
                                <Input id="name" name="name" />
                            </div>
                            <div class="space-y-1">
                                <Label for="email">Email</Label>
                                <Input id="email" type="email" name="email" />
                            </div>
                            <div class="space-y-1">
                                <Label for="susername">Username</Label>
                                <Input id="susername" name="username" />
                            </div>
                            <div class="space-y-1">
                                <Label for="spassword">Password</Label>
                                <Input id="spassword" type="password" minlength={8} name="password" />
                            </div>
                            <div class="space-y-1">
                                <Label for="spasswordconfirm">Confirm Password</Label>
                                <Input id="spasswordconfirm" minlength={8} type="password" name="passwordConfirm" />
                            </div>
                        </Card.Content>
                        <Card.Footer>
                            <Button type="submit">Create Account</Button>
                        </Card.Footer>
                    </form>
                </Card.Root>
            </Tabs.Content>
        </Tabs.Root>
    </Dialog.Content>
</Dialog.Root>

<main class="min-w-screen min-h-screen relative isolate">
    <Floaters />
    <section class="w-screen h-screen flex justify-center items-center flex-col bg-gradient-to-t from-secondary dark:to-black to-white">
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mt-10">Unlocking Security, One Key at a Time!</h1>
        <p class="leading-7 [&:not(:first-child)]:mt-6">A 3rd party authentication service that we use in-house and made it public for you to use.</p>
        <Button class="mt-10">Documentation</Button>
    </section>
</main>