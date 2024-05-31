<script lang="ts">
    export let data;
</script>

<svelte:head>
    <title>{data.authClient.name} | GAuth</title>
</svelte:head>

{#if data.user}
    <div class="flex flex-col w-full h-full p-10">
        <h3 class="text-2xl font-medium">{data.authClient.name}</h3>
        <div class="w-full h-full px-5">
            <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mt-7">Analytics</h4>
            <p class="leading-6 text-sm mt-3">Check out the stats on this auth client.</p>
        </div>
    </div>
{/if}