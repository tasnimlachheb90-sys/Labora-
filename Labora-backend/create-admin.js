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
        const firstname = await rl.question("Prénom : ");
        const lastname = await rl.question("Nom : ");
        const email = await rl.question("Email : ");
        const username = await rl.question("Username Admin : ");
        const password = await rl.question("Mot de passe (8 caractères minimum) : ");

        if (!firstname || !lastname || !username || password.length < 8) {
            console.log("Informations invalides ou mot de passe trop court.");
            return;
        }

        const existing = await User.findOne({
            where: { username }
        });

        if (existing) {
            console.log("Ce username existe déjà.");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            firstname,
            lastname,
            email: email || null,
            username,
            password: hashedPassword,
            role: "Admin"
        });

        console.log("Compte Admin créé avec succès !");
    } catch (error) {
        console.error("Erreur :", error.message);
    } finally {
        rl.close();
        await User.sequelize.close();
    }
})();
