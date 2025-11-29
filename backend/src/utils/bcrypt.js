import bcrypt from 'bcrypt';

// 10 est un bon compromis sécurité/performance
const SALT_ROUNDS = 10;

// Hash un mot de passe en clair
const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

// Compare un mot de passe en clair avec un hash
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export { hashPassword, comparePassword };