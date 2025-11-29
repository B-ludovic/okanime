import multer from 'multer';
import { HttpBadRequestError } from '../utils/httpErrors.js';

// On n'enregistre PAS sur le disque, on upload directement vers Cloudinary
const storage = multer.memoryStorage();

// Fonction pour filtrer les types de fichiers acceptés
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    // Fichier accepté
    cb(null, true);
  } else {
    // Fichier rejeté
    cb(
      new HttpBadRequestError(
        'Format de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP'
      ),
      false
    );
  }
};

// Configuration de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite à 5 MB
  },
});

// Middleware pour uploader un seul fichier
export const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const multerSingle = upload.single(fieldName);

    multerSingle(req, res, (err) => {
      // Gestion des erreurs Multer
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new HttpBadRequestError('Le fichier est trop volumineux. Taille maximale : 5 MB'));
        }
        return next(new HttpBadRequestError(`Erreur lors de l'upload : ${err.message}`));
      }

      if (err) {
        return next(err);
      }

      // Vérifie qu'un fichier a bien été uploadé
      if (!req.file) {
        return next(new HttpBadRequestError('Aucun fichier fourni'));
      }

      next();
    });
  };
};

// Middleware pour uploader plusieurs fichiers
export const uploadMultiple = (fields) => {
  return (req, res, next) => {
    const multerFields = upload.fields(fields);

    multerFields(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new HttpBadRequestError('Un des fichiers est trop volumineux. Taille maximale : 5 MB'));
        }
        return next(new HttpBadRequestError(`Erreur lors de l'upload : ${err.message}`));
      }

      if (err) {
        return next(err);
      }

      next();
    });
  };
};

// Middleware optionnel : le fichier peut être présent ou non
export const uploadSingleOptional = (fieldName) => {
  return (req, res, next) => {
    const multerSingle = upload.single(fieldName);

    multerSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new HttpBadRequestError('Le fichier est trop volumineux. Taille maximale : 5 MB'));
        }
        return next(new HttpBadRequestError(`Erreur lors de l'upload : ${err.message}`));
      }

      if (err) {
        return next(err);
      }

      next();
    });
  };
};