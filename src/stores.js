import { writable } from 'svelte/store';

export const filter = writable('all');
export const error = writable(false);
export const tasks = writable([]);