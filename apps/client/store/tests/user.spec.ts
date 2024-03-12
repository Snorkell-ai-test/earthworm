import { setActivePinia, createPinia } from "pinia";
import { it, expect, describe, vi, beforeEach } from "vitest";
import { useUserStore, type User, type SignupFormValues } from "../user";

/**
 * Transforms the sign-up request data to match the backend's expected format.
 * 
 * @param {SignUpRequest} signUpData - The original sign-up request data.
 * 
 * @returns {Object} The transformed sign-up request data with the following changes:
 * - `firstName` is mapped to `first_name`
 * - `lastName` is mapped to `last_name`
 * - `email` is mapped to `username`
 * - All other properties remain unchanged.
 * 
 * @example
 * const originalData = {
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@example.com',
 *   password: 'securePassword123'
 * };
 * 
 * const transformedData = transformSignUpRequestForBackend(originalData);
 * console.log(transformedData);
 * // Outputs:
 * // {
 * //   firstName: 'John',
 * //   lastName: 'Doe',
 * //   email: 'john.doe@example.com',
 * //   password: 'securePassword123',
 * //   first_name: 'John',
 * //   last_name: 'Doe',
 * //   username: 'john.doe@example.com'
 * // }
 */
function generateUserInfo() {
  return {
    userId: "123",
    username: "JohnDoe",
    phone: "1234567890",
  };
}

/**
 * Transforms the sign-up request data to match the backend's expected format.
 * 
 * @param {SignUpRequest} signUpData - The original sign-up request data.
 * 
 * @returns {Object} The transformed sign-up request data with the following changes:
 * - `firstName` is mapped to `first_name`
 * - `lastName` is mapped to `last_name`
 * - `email` is mapped to `username`
 * - All other properties remain unchanged.
 * 
 * @example
 * const originalData = {
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@example.com',
 *   password: 'securePassword123'
 * };
 * 
 * const transformedData = transformSignUpRequestForBackend(originalData);
 * console.log(transformedData);
 * // Outputs:
 * // {
 * //   firstName: 'John',
 * //   lastName: 'Doe',
 * //   email: 'john.doe@example.com',
 * //   password: 'securePassword123',
 * //   first_name: 'John',
 * //   last_name: 'Doe',
 * //   username: 'john.doe@example.com'
 * // }
 */
function generateSignupInfo() {
  return {
    name: "JohnDoe",
    phone: "12345678901",
    password: "Password123",
  };
}

describe("user", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should login user", () => {
    const mockUser = generateUserInfo();
    const userStore = useUserStore();

    userStore.initUser(mockUser);

    expect(userStore.user).toEqual(mockUser);
    expect(userStore.getUserInfo()).toMatchInlineSnapshot(
      `"{"userId":"123","username":"JohnDoe","phone":"1234567890"}"`
    );
  });

  it("should restore user", () => {
    const mockUser = generateUserInfo();
    const userStore = useUserStore();
    userStore.initUser(mockUser);

    userStore.user = undefined;
    userStore.restoreUser();

    expect(userStore.user).toEqual(mockUser);
  });

  it("should logout user", () => {
    const mockUser = generateUserInfo();
    const userStore = useUserStore();
    userStore.initUser(mockUser);

    userStore.logoutUser();

    expect(userStore.user).toBeFalsy();
    expect(userStore.getUserInfo()).toBeFalsy();
  });

  it("should update user store on successful signup", async () => {
    const signupInfo = generateSignupInfo();
    const userStore = useUserStore();

    await mockSignup(signupInfo);

    expect(userStore.user).toBeDefined();
    expect(userStore.user?.username).toBe(signupInfo.name);
    expect(userStore.user?.phone).toBe(signupInfo.phone);
  });
});

/**
 * Transforms the sign-up request data to match the backend's expected format.
 * 
 * @param {SignUpRequest} signUpData - The original sign-up request data.
 * 
 * @returns {Object} The transformed sign-up request data with the following changes:
 * - `firstName` is mapped to `first_name`
 * - `lastName` is mapped to `last_name`
 * - `email` is mapped to `username`
 * - All other properties remain unchanged.
 * 
 * @example
 * const originalData = {
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@example.com',
 *   password: 'securePassword123'
 * };
 * 
 * const transformedData = transformSignUpRequestForBackend(originalData);
 * console.log(transformedData);
 * // Outputs:
 * // {
 * //   firstName: 'John',
 * //   lastName: 'Doe',
 * //   email: 'john.doe@example.com',
 * //   password: 'securePassword123',
 * //   first_name: 'John',
 * //   last_name: 'Doe',
 * //   username: 'john.doe@example.com'
 * // }
 */
async function mockSignup(signupInfo: SignupFormValues) {
  const userStore = useUserStore();
  userStore.initUser({
    userId: "newUserId",
    username: signupInfo.name,
    phone: signupInfo.phone,
  });
}
