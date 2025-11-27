// importation des dependances

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Route POST /register - Inscription
router.post('/register', async (req, res) => {
    try {
        // recuperer les donnes du body
        const { email, username, password } = req.body;

        // verifier que tous les champs sont presents
        if (!email || !username || !password) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        // verifier si l'utilisateur existe deja
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Utilisateur deja existe.' });
        }

        // hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // creer le nouvel utilisateur
        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });

        // Retourner l'utilisateur cree (sans le mot de passe)
        res.status(201).json({ id: newUser.id, email: newUser.email, username: newUser.username });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur du serveur.' });
    }
});

// Route POST /login - Connexion
router.post('/login', async (req, res) => {
    try {
        // recuperer les donnes du body
        const { email, password } = req.body;

        // verifier que tous les champs sont presents
        if (!email || !password) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        // verifier si l'utilisateur existe
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouve.' });
        }

        // verifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // Créer un token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Retourner le token
        res.json({ message: 'Connexion reussie.', token, user: { id: user.id, email: user.email, username: user.username } });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur du serveur.' });
    }
});

module.exports = router;