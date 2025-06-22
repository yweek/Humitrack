import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Utiliser explicitement la clé service_role pour bypasser le RLS
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.log('Assurez-vous que VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définies');
  process.exit(1);
}

// Créer le client avec la clé service_role et les options pour bypasser le RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Lire le fichier JSON des cigares traités
const processedCigars = JSON.parse(fs.readFileSync('processed_cigars.json', 'utf8'));

// Fonction pour normaliser les valeurs de force
function normalizeStrength(strength) {
  switch (strength) {
    case 'Medium-Full':
      return 'Full';
    case 'Medium-Full':
      return 'Full';
    default:
      return strength;
  }
}

// Fonction pour importer les cigares
async function importCigars() {
  console.log('🚬 Début de l\'importation des cigares dans Supabase...');
  console.log(`📊 ${processedCigars.length} cigares à importer`);

  let successCount = 0;
  let errorCount = 0;

  for (const cigar of processedCigars) {
    try {
      // Préparer les données pour la base de données
      const cigarData = {
        brand: cigar.brand,
        name: cigar.name,
        size: '5 x 50', // Taille par défaut
        format: 'Robusto', // Format par défaut
        country: cigar.origin,
        strength: normalizeStrength(cigar.strength), // Normaliser la force
        wrapper: cigar.wrapper,
        price: getPriceFromRange(cigar.price_range),
        quantity: 0, // Quantité par défaut
        ring_gauge: 50, // Ring gauge par défaut
        factory: '', // À remplir plus tard
        release_year: null, // À remplir plus tard
        purchase_location: '', // À remplir plus tard
        low_stock_alert: 5, // Valeur par défaut
        added_date: new Date().toISOString(),
        aging_start_date: new Date().toISOString(),
        tags: [], // Tags vides par défaut
        photo: cigar.image_url || '',
        in_wishlist: false,
        user_id: null // Sera défini lors de l'ajout par l'utilisateur
      };

      // Insérer dans la base de données avec la clé service_role
      const { data, error } = await supabase
        .from('cigars')
        .insert([cigarData])
        .select()
        .single();

      if (error) {
        console.error(`❌ Erreur pour ${cigar.name}:`, error.message);
        console.error('Détails de l\'erreur:', error);
        errorCount++;
      } else {
        console.log(`✅ ${cigar.name} (${cigar.brand}) importé avec succès`);
        successCount++;
      }

      // Pause pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`❌ Erreur inattendue pour ${cigar.name}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n📋 Résumé de l\'importation:');
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`📊 Total: ${processedCigars.length}`);
}

// Fonction pour convertir la gamme de prix en valeur numérique
function getPriceFromRange(priceRange) {
  switch (priceRange) {
    case '$':
      return 5; // Prix bas
    case '$$':
      return 15; // Prix moyen
    case '$$$':
      return 25; // Prix élevé
    case '$$$$':
      return 50; // Prix très élevé
    default:
      return 15; // Prix moyen par défaut
  }
}

// Exécuter l'importation
importCigars()
  .then(() => {
    console.log('\n🎉 Importation terminée !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erreur lors de l\'importation:', error);
    process.exit(1);
  }); 