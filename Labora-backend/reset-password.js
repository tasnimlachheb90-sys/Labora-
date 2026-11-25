require("dotenv").config();
const User = require("./models/user.model");
const bcrypt = require("bcrypt");
const readline = require("readline/promises");

(async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        const username = "ahmed_test";
        const password = await rl.question("Entre ton nouveau mot de passe : ");

        if (password.length < 8) {
            console.log("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        const user = await User.findOne({ where: { username } });

        if (!user) {
            console.log("Utilisateur introuvable.");
            return;
        }

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        console.log("Mot de passe réinitialisé avec succès !");
    } catch (error) {
        console.error("Erreur :", error.message);
    } finally {
        rl.close();
        await User.sequelize.close();
    }
})();
