import { browser } from '$app/environment';

export const hasShare = browser ? typeof navigator['share'] !== 'undefined' : false;
