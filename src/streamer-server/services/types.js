/**
 * @typedef Database
 * @prop {string} clientSecret
 * @prop {{ accessToken: string, expiresAt: string, refreshToken: string } | undefined} token
 * @prop {{ display_name: string | null, email: string | undefined } | undefined} profile
 * @prop {{ bluetoothAddress: string, name: string, customName: string | undefined }[]} devices
 */

export const Types = {};
