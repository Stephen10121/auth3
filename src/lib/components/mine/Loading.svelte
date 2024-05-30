<!-- https://codepen.io/lsxzeltrox/pen/ExzNNLp -->

<div class="smart-glass">
    <div class="logo">
        <div class="dark:border-t-white border-t-black border-transparent border-4 w-full h-full rounded-full spin p-1.5">
            <div class="dark:border-t-white border-t-black border-transparent border-4 w-full h-full rounded-full spin p-1.5">
                <div class="dark:border-t-white border-t-black border-transparent border-4 w-full h-full rounded-full spin p-1.5" />
            </div>
        </div>
    </div>
</div>

<style>
    .smart-glass {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .logo {
        width: 188px;
        height: 188px;
        position: relative;
    }

    .spin {
        animation: connect 2.5s linear infinite;
    }

    @keyframes connect {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>