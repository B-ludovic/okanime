import cloudinary from '../config/cloudinary.js';
import { HttpInternalServerError } from '../utils/httpErrors.js';

// Upload un fichier vers Cloudinary
const uploadToCloudinary = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    // Création d'un stream pour uploader le buffer
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `okanime/${folder}`, // Organise les fichiers par dossier
        resource_type: 'auto', // Détecte automatiquement le type de fichier
        transformation: [
          { quality: 'auto' }, // Optimisation automatique de la qualité
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(new HttpInternalServerError('Erreur lors de l\'upload de l\'image'));
        } else {
          // Retourne l'URL sécurisée de l'image uploadée
          resolve(result.secure_url);
        }
      }
    );

    // Écrit le buffer dans le stream
    uploadStream.end(fileBuffer);
  });
};

// Supprime une image de Cloudinary
// imageUrl: l'URL complète de l'image à supprimer
const deleteFromCloudinary = async (imageUrl) => {
  try {
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1].split('.')[0];
    const folder = urlParts[urlParts.length - 2];
    const publicId = `okanime/${folder}/${fileName}`;

    await cloudinary.uploader.destroy(publicId);
    console.log(`Image supprimée de Cloudinary: ${publicId}`);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error);
  }
};

// Upload un avatar utilisateur
const uploadAvatar = async (fileBuffer) => {
  return uploadToCloudinary(fileBuffer, 'avatars');
};

// Upload un poster d'anime
const uploadPoster = async (fileBuffer) => {
  return uploadToCloudinary(fileBuffer, 'posters');
};

export {
  uploadAvatar,
  uploadPoster,
  deleteFromCloudinary,
};