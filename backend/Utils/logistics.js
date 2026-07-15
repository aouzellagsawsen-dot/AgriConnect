/**
 * Calcule la distance fictive et le coût de livraison
 * @param {string} farmerRegion - Wilaya/Région du fermier
 * @param {string} buyerRegion - Wilaya/Région de l'acheteur
 * @returns {object} { distanceKm, deliveryFee }
 */
export const calculateLogistics = (farmerRegion, buyerRegion) => {
  const basePrice = 500; // Frais fixes de prise en charge (500 DZD)
  const pricePerKm = 80;  // Tarif de transport (80 DZD par kilomètre)
  
  // Simulation d'une distance réaliste (entre 15km et 135km)
  // Plus tard, tu pourras brancher une API de cartographie ici
  const mockDistance = Math.floor(Math.random() * 120) + 15; 
  
  // Formule mathématique :
  // $$Tarif = Frais\:Fixes + (Distance \times Tarif\:au\:Km)$$
  const deliveryFee = basePrice + (mockDistance * pricePerKm);
  
  return { 
    distanceKm: mockDistance, 
    deliveryFee 
  };
};