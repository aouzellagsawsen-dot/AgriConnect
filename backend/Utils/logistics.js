import axios from 'axios';

// Dictionnaire mis à jour avec vos nouvelles villes (Longitude, Latitude)
const citiesCoordinates = {
  // ALGERIA
  "Algiers": "3.0588,36.7538",
  "Oran": "-0.6331,35.6987",
  "Constantine": "6.6147,36.3650",
  "Béjaïa": "5.0843,36.7559",
  "Sétif": "5.4029,36.1905",
  "Batna": "6.1738,35.5562",
  "Tizi Ouzou": "4.0459,36.7118",
  "Jijel": "5.7663,36.8205",
  "Skikda": "6.9092,36.8794",
  "Annaba": "7.7601,36.9000",
  "Guelma": "7.4286,36.4621",
  "Tindouf": "-8.1478,27.6711",

  // MOROCCO
  "Casablanca": "-7.5898,33.5731",
  "Rabat": "-6.8326,34.0209",
  "Marrakech": "-8.0083,31.6295",
  "Fes": "-5.0078,34.0331",
  "Tangier": "-5.8115,35.7595",

  // TUNISIA
  "Tunis": "10.1815,36.8065",
  "Sfax": "10.7603,34.7406",
  "Sousse": "10.6369,35.8254",
  "Kairouan": "10.0963,35.6781",
  "Bizerte": "9.8739,37.2744",

  // MAURITANIA
  "Nouakchott": "-15.9785,18.0790",
  "Nouadhibou": "-17.0347,20.9310",
  "Rosso": "-15.8080,16.5148",

  // LIBYA
  "Tripoli": "13.1913,32.8802",
  "Benghazi": "20.0667,32.1167",
  "Misrata": "15.0914,32.3754"
};

/**
 * Calcule la distance réelle via OSRM et le coût de livraison[cite: 18]
 * @param {string} farmerRegion - Ville de départ
 * @param {string} buyerRegion - Ville d'arrivée
 * @returns {Promise<object>} { distanceKm, deliveryFee }
 */
export const calculateLogistics = async (farmerRegion, buyerRegion) => {
  const basePrice = 50; // Frais fixes de prise en charge (500 DZD)[cite: 18]
  const pricePerKm = 80;  // Tarif de transport (80 DZD par kilomètre)[cite: 18]
  
  try {
    const getCoordinatesInsensitive = (cityName) => {
      if (!cityName) return "3.0588,36.7538"; // Alger par défaut
      
      const normalizedInput = cityName.trim().toLowerCase();
      
      // On cherche la clé dans ton objet citiesCoordinates en ignorant la casse
      const cityKey = Object.keys(citiesCoordinates).find(
        key => key.toLowerCase() === normalizedInput
      );
      
      return cityKey ? citiesCoordinates[cityKey] : "3.0588,36.7538";
    };
    // 1. Récupération des coordonnées depuis votre liste exacte
    const coord1 = getCoordinatesInsensitive(farmerRegion);
    const coord2 = getCoordinatesInsensitive(buyerRegion);
    // Si le départ et l'arrivée sont dans la même ville, forfait fixe local de 15km
    if (coord1 === coord2) {
      return { 
        distanceKm: 15, 
        deliveryFee: basePrice + (15 * pricePerKm) 
      };
    }

    // 2. Appel à l'API gratuite OSRM
    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coord1};${coord2}?overview=false`;
    const response = await axios.get(osrmUrl);

    // 3. Conversion de la distance de mètres en kilomètres
    const distanceMeters = response.data.routes[0].distance;
    const realDistanceKm = Math.round(distanceMeters / 1000); 
    
    // 4. Calcul du tarif réel[cite: 18]
    const deliveryFee = basePrice + (realDistanceKm * pricePerKm);
    
    return { 
      distanceKm: realDistanceKm, 
      deliveryFee 
    };
  } catch (error) {
    console.error("Erreur avec l'API OSRM :", error);
    // Solution de secours : forfait standard de 50km
    return { 
      distanceKm: 50, 
      deliveryFee: basePrice + (50 * pricePerKm) 
    };
  }
};