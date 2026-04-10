import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export const hashPassword = async (value: string) => {
  return bcrypt.hash(value, SALT_ROUNDS)
}

export const comparePassword = async (plainValue: string, hashedValue: string) => {
  return bcrypt.compare(plainValue, hashedValue)
}
