<script lang="ts">
    import { toast } from 'svelte-sonner';
    import {
    Button,
    buttonVariants
  } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';

    export let form;

    $: {
        if (form) {
            if (form.error) {
                toast.error("Error", { description: form.message});
            } else if (form.success) {
                toast.success("Success", {description: form.message});
                goto("/");
            }
        }
    }
</script>

<div class="w-full h-screen p-10">
    <div class="w-full h-full flex flex-col items-center justify-center">
        <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mt-7">Reset Password</h4>
        <form action="?/resetPassword" method="POST" class="flex flex-col items-start w-full max-w-xl" use:enhance>
            <div class="mt-5 w-full">
                <Label for="email">Email</Label>
                <Input id="email" name="email" type="email" class="w-full" required />
            </div>
            <Button type="submit" class="w-full mt-5">Request Password Reset</Button>
        </form>
    </div>
</div>