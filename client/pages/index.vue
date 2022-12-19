<template>
    <div class="flex justify-center">
        <RouterLink to="/add" v-if="state.key">Add Password</RouterLink>
    </div>

    <template v-for="row in passwords">
        <div class="p-5 m-5 bg-base-200 rounded shadow-md">
            <label class="text-neutral-content text-xl">
                {{capitalizeFirstLetter(row.type)}} - {{row.identifier}}
            </label>
            <br>

            <template v-if="row.reveal">
                <input :value="row.password" class="input input-sm input-bordered m-2"/>
                <br>
            </template>

            <div class="button-group">
                <button @click="revealPassword(row)">{{ row.reveal ? "Hide" : "Show" }}</button>
                <button class="px-1">Copy</button>
                <button>Settings</button>
            </div>
        </div>
    </template>
</template>

<script setup lang="ts">
    import CryptoJS from "crypto-js";
    import { useGlobalStore } from "@/stores/global";
    import { capitalizeFirstLetter } from "@/utils";

    const state = useGlobalStore();

    await state.fetchPasswords();

    const passwords = ref<any>([]);

    const router = useRouter();

    const revealPassword = (passed_row: any) => {
        passwords.value = passwords.value.map((row: any) => {
            if(passed_row === row) row.reveal = !row.reveal;

            return row;
        });
    }

    if(process.client) {
        state.getKey();
        state.getToken();

        if(!state.token) {
            router.push("/register");
        }else if(!state.key) {
            router.push("/key");
        }else {
            await state.fetchUser();
            await state.fetchPasswords();

            if(state.passwords) {
                passwords.value = state.passwords.map((row: any) => {
                    const encryptionKey = state.key;
                    
                    row.reveal = false;

                    if(encryptionKey) {
                        const decrypted = CryptoJS.AES.decrypt(row.password, encryptionKey).toString(CryptoJS.enc.Utf8);
                        row.password = decrypted.length < 1 ? "Decryption key invalid" : decrypted;
                    }else {
                        row.password = "Encryption key is not set";
                    }

                    return row;
                });
            }
        }
    }
</script>