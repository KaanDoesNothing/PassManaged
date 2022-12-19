<template>
    <div class="bg-base-100 min-h-screen" style="overflow-y: hidden;">
        <div class="text-center">
            <label class="text-xl">Login</label>

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
            <label>Email</label>
            <br>
            <input type="text" class="input input-sm input-bordered input-info" name="email">
            <br>
            <label>Password</label>
            <br>
            <input type="password" class="input input-sm input-bordered input-info" name="password">
            <br>
            <button type="submit">Login</button>
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
        const email = e.target.email.value;
        const password = e.target.password.value;

        if(error) error.value = null;

        const res = await (await fetch(`${config.public.API}/login`, {method: "post", body: JSON.stringify({email, password})})).json();
        if(res.error) error.value = res.error;
        
        state.setToken(res.token);
        state.getToken();

        await state.fetchUser();
        
        router.push("/key");
    }
</script>