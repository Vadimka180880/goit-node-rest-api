import Contact from "../models/Contact.js";

// GET /api/contacts
export async function listContacts() {
  const rows = await Contact.findAll();
  return rows.map(r => r.toJSON());
}

// GET /api/contacts/:id
export async function getContactById(contactId) {
  const row = await Contact.findByPk(contactId);
  return row ? row.toJSON() : null;
}

// POST /api/contacts
// очікує body: { name, email, phone, favorite? }
export async function addContact(data) {
  const { name, email, phone, favorite } = data;
  const created = await Contact.create({ name, email, phone, favorite });
  return created.toJSON();
}

// PUT /api/contacts/:id
// приймає будь-який піднабір полів (name|email|phone|favorite)
export async function updateContactById(contactId, data) {
  const row = await Contact.findByPk(contactId);
  if (!row) return null;
  await row.update(data);
  return row.toJSON();
}

// DELETE /api/contacts/:id
export async function removeContactById(contactId) {
  const row = await Contact.findByPk(contactId);
  if (!row) return null;
  const json = row.toJSON(); 
  await row.destroy();
  return json;
}

export async function updateStatusContact(contactId, body) {
  const row = await Contact.findByPk(contactId);
  if (!row) return null;
  await row.update({ favorite: body.favorite });
  return row.toJSON();
}

// аліаси під контролери/роутер
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
  updateStatusContact,
};

export default contactsService;
