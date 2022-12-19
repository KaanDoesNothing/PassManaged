import {defineStore} from "pinia";

export const useGlobalStore = defineStore("global", {
    state: (): any => {
        return {token: null, user: undefined, passwords: [], key: null}
    },
    actions: {
        async fetchUser() {
            const config = useRuntimeConfig();

            const res: any = await $fetch(`${config.public.API}/user`, {body: {token: this.token}, method: "POST"}).catch(err => console.log("Unable to fetch user data"));

            if(!res) return;

            if(res.user) {
                this.user = res.user;
            }
        },
        async fetchPasswords() {
            const config = useRuntimeConfig();

            const res: any = await $fetch(`${config.public.API}/user/get_passwords`, {body: {token: this.token}, method: "POST"}).catch(err => console.log("Unable to fetch user data"));

            if(!res) return;

            if(res.passwords) {
                this.passwords = res.passwords;
            }
        },
        getKey() {
            this.key = localStorage.getItem("encryption_key");
        },
        setKey(key: string) {
            localStorage.setItem("encryption_key", key);
        },
        getToken() {
            this.token = localStorage.getItem("token");
        },
        setToken(token: string) {
            localStorage.setItem("token", token);
        }
    }
});