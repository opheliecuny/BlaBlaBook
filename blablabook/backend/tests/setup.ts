import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Charger les variables d'environnement du fichier .env.test
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../.env.test") });

// Configuration globale pour les tests
console.log("🧪 Tests en cours avec NODE_ENV:", process.env.NODE_ENV);
console.log("📊 Database URL:", process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":****@"));
