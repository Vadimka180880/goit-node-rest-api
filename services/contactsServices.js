import Contact from "../models/Contact.js";

// GET /api/contacts
export async function listContacts(ownerId) {
  const rows = await Contact.findAll({ where: { owner: ownerId } });
  return rows.map(r => r.toJSON());
}

// GET /api/contacts/:id
export async function getContactById(ownerId, contactId) {
  const row = await Contact.findOne({ where: { id: contactId, owner: ownerId } });
  return row ? row.toJSON() : null;
}

// POST /api/contacts
export async function addContact(ownerId, data) {
  const { name, email, phone, favorite } = data;
  const created = await Contact.create({ name, email, phone, favorite, owner: ownerId });
  return created.toJSON();
}

// PUT /api/contacts/:id
export async function updateContactById(ownerId, contactId, data) {
  const row = await Contact.findOne({ where: { id: contactId, owner: ownerId } });
  if (!row) return null;
  await row.update(data);
  return row.toJSON();
}

// DELETE /api/contacts/:id
export async function removeContactById(ownerId, contactId) {
  const row = await Contact.findOne({ where: { id: contactId, owner: ownerId } });
  if (!row) return null;
  const json = row.toJSON(); 
  await row.destroy();
  return json;
}

export async function updateStatusContact(ownerId, contactId, body) {
  const row = await Contact.findOne({ where: { id: contactId, owner: ownerId } });
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
