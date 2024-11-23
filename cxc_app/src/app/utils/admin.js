import { makeRequest } from "./api";

export async function fetchUsers() {
    return makeRequest ('admin/users', 'GET');
}