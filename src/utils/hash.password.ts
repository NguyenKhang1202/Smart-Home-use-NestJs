/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcrypt';

export default async function hashPassword(password: string): Promise<string> {
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(password, saltOrRounds);
  return hash;
}
