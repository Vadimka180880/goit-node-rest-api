import contactsService from "../services/contactsServices.js";
import { addContactSchema, updateContactSchema, updateFavoriteSchema } from "../schemas/contactsSchemas.js";

// GET /api/contacts
export const getAllContacts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const rawLimit = parseInt(req.query.limit, 10);
    const limit = Math.min(Math.max(isNaN(rawLimit) ? 20 : rawLimit, 1), 100);
    let favorite;
    if (typeof req.query.favorite !== "undefined") {
      const val = String(req.query.favorite).toLowerCase();
      favorite = val === "true" || val === "1";
    }
    const contacts = await contactsService.listContacts(req.user.id, { page, limit, favorite });
    res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
};

// GET /api/contacts/:id
export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
  const contact = await contactsService.getContactById(req.user.id, id);
    if (!contact) return res.status(404).json({ message: "Not found" });
    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
};

// POST /api/contacts
export const createContact = async (req, res, next) => {
  try {
    const { error } = addContactSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
  const newContact = await contactsService.addContact(req.user.id, req.body);
    res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
};

// PUT /api/contacts/:id
export const updateContact = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Body must have at least one field" });
    }
    const { error } = updateContactSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

  const { id } = req.params;
  const updated = await contactsService.updateContact(req.user.id, id, req.body);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/contacts/:id
export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
  const removed = await contactsService.removeContact(req.user.id, id);
    if (!removed) return res.status(404).json({ message: "Not found" });
    res.status(200).json(removed);
  } catch (err) {
    next(err);
  }
};

export const updateFavorite = async (req, res, next) => {
  try {
  const { contactId } = req.params;
    
    if (!Object.prototype.hasOwnProperty.call(req.body, "favorite")) {
      return res.status(400).json({ message: "Missing field favorite" });
    }

    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

  const updated = await contactsService.updateStatusContact(req.user.id, contactId, req.body);
    if (!updated) return res.status(404).json({ message: "Not found" });

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export default {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  deleteContact,
  updateFavorite,
};
