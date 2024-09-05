import crypto from "crypto"

export const secrate=crypto.randomBytes(36).toString('hex')