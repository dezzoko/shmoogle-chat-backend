import * as bcrypt from 'bcrypt';

export async function hashPasword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}
