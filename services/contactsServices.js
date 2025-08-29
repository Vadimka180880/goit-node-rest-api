import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// шлях до JSON-файлу
const contactsPath = path.join(__dirname, "../db/contacts.json");

// ==== базові функції ====
export async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find((c) => c.id === contactId) || null;
}

export async function addContact(data) {
  const { name, email, phone } = data;
  const contacts = await listContacts();
  const newContact = { id: randomUUID(), name, email, phone };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

export async function updateContactById(contactId, data) {
  const contacts = await listContacts();
  const index = contacts.findIndex((c) => c.id === contactId);
  if (index === -1) return null;

  contacts[index] = { ...contacts[index], ...data };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}

export async function removeContactById(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((c) => c.id === contactId);
  if (index === -1) return null;

  const [removed] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return removed;
}

export const updateContact = updateContactById;
export const removeContact = removeContactById;

const contactsService = {
  listContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContactById,
  updateContact,  
  removeContact,
};

export default contactsService;
