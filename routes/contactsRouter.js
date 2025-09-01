import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite, 
} from "../controllers/contactsControllers.js";

import validateBody from "../helpers/validateBody.js";
import { addContactSchema, updateContactSchema, updateFavoriteSchema } from "../schemas/contactsSchemas.js";
import validateFavoritePresence from "../helpers/validateFavoritePresence.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);
contactsRouter.get("/:id", getOneContact);
contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(addContactSchema), createContact);
contactsRouter.put("/:id", validateBody(updateContactSchema), updateContact);
contactsRouter.patch("/:contactId/favorite", validateFavoritePresence, validateBody(updateFavoriteSchema), updateFavorite);

export default contactsRouter;
