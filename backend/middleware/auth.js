// Middleware pour verifier le token JWT
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // recuperer le token depuis les headers d'autorisation
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        //si pas de token, renvoyer une erreur
        if (!token) {
            return res.status(401).json({ message: 'Acces non autorise. Token manquant.' });
        }

        // verfier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ajouter l'ID de l'utilisateur a la requete
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).json({ message: 'Acces non autorise. Token invalide.' });
    }
};

module.exports = authMiddleware;