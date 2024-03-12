import { setToken } from "~/utils/token";
import { fetchLogin, fetchSignUp } from "~/api/auth";
import { useUserStore } from "~/store/user";

/**
 * Asynchronously logs in the user using the provided phone number and password.
 * 
 * @param phone The phone number of the user.
 * @param password The password of the user.
 * @throws {Error} If there is an error during the login process.
 */
async function login({ phone, password }: { phone: string; password: string }) {
  const userStore = useUserStore();

  const data = await fetchLogin({
    phone,
    password,
  });

  setToken(data.token);
  userStore.initUser(data.user);
}

/**
 * Asynchronously signs up a user with the provided phone, name, and password.
 * @param phone The phone number of the user.
 * @param name The name of the user.
 * @param password The password of the user.
 * @throws {Error} Throws an error if there is an issue with signing up the user.
 */
async function signup({
  phone,
  name,
  password,
}: {
  phone: string;
  name: string;
  password: string;
}) {
  const userStore = useUserStore();

  const data = await fetchSignUp({
    phone,
    name,
    password,
  });

  setToken(data.token);
  userStore.initUser(data.user);
}

/**
 * Returns an object with login and signup functions.
 * @returns {{ login: () => void, signup: () => void }}
 * @throws {Error} If authentication fails.
 */
export function useAuth() {
  return {
    login,
    signup
  };
}
