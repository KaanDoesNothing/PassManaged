<template>
    <div class="bg-base-100 min-h-screen" style="overflow-y: hidden;">
        <div class="text-center">
            <label class="text-xl">Add a password</label>

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
            <label>Type</label>
            <br>
            <select class="rounded p-1 m-5 px-5" required @change="handleSelect" id="type">
                <option value="mail">Mail</option>
                <option value="other">Other</option>
            </select>
            <template v-if="isCustomType">
                <input type="text" class="input input-sm input-bordered input-info" name="type" id="customType"/>
                <br>
            </template>
            <br>
            <label>Identifier</label>
            <br>
            <input type="text" class="input input-sm input-bordered input-info" name="identifier">
            <br>
            <label>Password</label>
            <br>
            <input type="password" class="input input-sm input-bordered input-info" name="password">
            <br>
            <br>
            <button type="submit">Add</button>
        </form>
    </div>
</template>

<script setup lang="ts">
    import CrptoJS from "crypto-js";
    import {useGlobalStore} from "@/stores/global";

    const error = ref<string | null>(null);
    const isCustomType = ref(false);

    const config = useRuntimeConfig();

    const state = useGlobalStore();

    const handleSelect = (e: any) => {
        isCustomType.value = e.target.value === "other";
    }

    const handleForm = async (e: any) => {
        const identifier = e.target.identifier.value;
        const password = e.target.password.value;

        const encryptionKey = localStorage.getItem("encryption_key");

        if(!encryptionKey) return alert("Encryption key not set!");

        const typeEl = document.querySelector<any>("#type");
        const customTypeEl = document.querySelector<any>("#customType");

        let type;

        if(typeEl.value !== "other") type = typeEl.value;
        if(typeEl.value === "other") type = customTypeEl.value;

        const encryptedPassword = CrptoJS.AES.encrypt(password, encryptionKey).toString();

        const res = await (await fetch(`${config.public.API}/user/create_password`, {method: "post", body: JSON.stringify({type, identifier, password: encryptedPassword, token: state.token})})).json();
        if(res.error) error.value = res.error;

        await state.fetchUser();

        useRouter().push("/");
    }
</script>