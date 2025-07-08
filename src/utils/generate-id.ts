import { customAlphabet } from 'nanoid';

// Gera um ID com 4 caracteres usando números e letras maiúsculas
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

export function generateShortId() {
  return nanoid();
}