// !! TODO : Fichier à supprimer dès que la bdd pourra stocker les jwt

import jwt from "jsonwebtoken";

const token = jwt.sign(
  { userId: "36e0ccc1-9f1c-4da1-9e10-3a50a433c21a" },
  "mon-super-secret-jwt",
  { expiresIn: "1h" }
);