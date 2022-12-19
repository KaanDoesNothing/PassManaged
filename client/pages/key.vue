<template>
    <div class="bg-base-100 min-h-screen" style="overflow-y: hidden;">
        <div class="text-center">
            <label class="text-xl">Encryption key</label>

            <template v-if="error">
                <br>
                <div class="p-4">
                    <div class="alert shadow-lg">
                        <div>
                        <label>Error: {{error}}</label>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <form class="mt-5 text-center" @submit.prevent="handleForm">
            <label class="text-center">Provide your encryption key</label>
            <br>
            <label>Key</label>
            <br>
            <input type="text" class="input input-sm input-bordered input-info" name="key">
            <br>
            <button type="submit">Set</button>
        </form>
    </div>
</template>

<script setup lang="ts">
    import {useGlobalStore} from "@/stores/global";

    const error = ref<string | null>(null);

    const config = useRuntimeConfig();

    const state = useGlobalStore();

    const router = useRouter();

    const handleForm = async (e: any) => {
        state.setKey(e.target.key.value);
        state.getKey();
        
        router.push("/");
    }
</script>