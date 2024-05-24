<script lang="ts">
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { Button } from "$lib/components/ui/button/index.js";

//    "size-9",
//                                 route.variant === "default" &&
//                                     "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
</script>

<main class="mt-20 flex gap-10">
    <aside class="flex w-96">
        <nav class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2 w-full">
        <Button
					href="#"
					variant="ghost"
					size="sm"
					class="justify-start"
				>
					<!-- <svelte:component this={route.icon} class="mr-2 size-4" aria-hidden="true" /> -->
					routetitle
				</Button>
        </nav>
    </aside>
    <!-- <aside class="flex flex-col">
        <a href="/settings">Settings</a>
        <a href="/settings/profile">Profile</a>
    </aside> -->
    
    <slot />
</main>
