export const regions = [
  { id: 'kinshasa', nom: 'Kinshasa', province: 'Kinshasa' },
  { id: 'lubumbashi', nom: 'Lubumbashi', province: 'Haut-Katanga' },
  { id: 'kisangani', nom: 'Kisangani', province: 'Tshopo' },
  { id: 'mbujimayi', nom: 'Mbuji-Mayi', province: 'Kasaï-Oriental' },
  { id: 'kananga', nom: 'Kananga', province: 'Kasaï-Central' },
  { id: 'bukavu', nom: 'Bukavu', province: 'Sud-Kivu' },
  { id: 'goma', nom: 'Goma', province: 'Nord-Kivu' },
  { id: 'matadi', nom: 'Matadi', province: 'Kongo Central' },
]

export const mockWeather: Record<string, { temp: number; condition: string; icon: string; humidite: number; vent: number }> = {
  kinshasa: { temp: 28, condition: 'Ensoleillé', icon: '☀️', humidite: 75, vent: 12 },
  lubumbashi: { temp: 22, condition: 'Nuageux', icon: '☁️', humidite: 65, vent: 18 },
  kisangani: { temp: 26, condition: 'Pluie légère', icon: '🌧️', humidite: 85, vent: 8 },
  mbujimayi: { temp: 24, condition: 'Partiellement nuageux', icon: '⛅', humidite: 70, vent: 10 },
  kananga: { temp: 25, condition: 'Ensoleillé', icon: '☀️', humidite: 68, vent: 14 },
  bukavu: { temp: 20, condition: 'Brouillard', icon: '🌫️', humidite: 90, vent: 5 },
  goma: { temp: 21, condition: 'Nuageux', icon: '☁️', humidite: 78, vent: 15 },
  matadi: { temp: 29, condition: 'Ensoleillé', icon: '☀️', humidite: 80, vent: 20 },
}

export const previsionsMeteo = [
  { jour: 'Lun', temp: 27, condition: '☀️' },
  { jour: 'Mar', temp: 28, condition: '⛅' },
  { jour: 'Mer', temp: 26, condition: '🌧️' },
  { jour: 'Jeu', temp: 25, condition: '🌧️' },
  { jour: 'Ven', temp: 27, condition: '☁️' },
  { jour: 'Sam', temp: 29, condition: '☀️' },
  { jour: 'Dim', temp: 30, condition: '☀️' },
]

export const mockPrix: Record<string, Array<{ produit: string; prix: number; unite: string; variation: string; categorie: string }>> = {
  kinshasa: [
    { produit: 'Œufs', prix: 380, unite: 'pièce', variation: '+8%', categorie: 'volaille' },
    { produit: 'Poulet de chair', prix: 8500, unite: 'pièce', variation: '+3%', categorie: 'volaille' },
    { produit: 'Maïs', prix: 2200, unite: 'kg', variation: '-2%', categorie: 'cereale' },
    { produit: 'Manioc', prix: 1800, unite: 'kg', variation: '+5%', categorie: 'tubercule' },
    { produit: 'Riz', prix: 3500, unite: 'kg', variation: '+1%', categorie: 'cereale' },
    { produit: 'Haricot', prix: 4500, unite: 'kg', variation: '-3%', categorie: 'legumineuse' },
    { produit: 'Tomate', prix: 2800, unite: 'kg', variation: '+12%', categorie: 'legume' },
    { produit: 'Oignon', prix: 3200, unite: 'kg', variation: '+4%', categorie: 'legume' },
    { produit: 'Banane plantain', prix: 1500, unite: 'rg', variation: '-1%', categorie: 'fruit' },
    { produit: 'Ananas', prix: 2500, unite: 'pièce', variation: '+2%', categorie: 'fruit' },
  ],
  lubumbashi: [
    { produit: 'Œufs', prix: 350, unite: 'pièce', variation: '+2%', categorie: 'volaille' },
    { produit: 'Poulet de chair', prix: 8200, unite: 'pièce', variation: '-1%', categorie: 'volaille' },
    { produit: 'Maïs', prix: 2100, unite: 'kg', variation: '+4%', categorie: 'cereale' },
    { produit: 'Manioc', prix: 1700, unite: 'kg', variation: '0%', categorie: 'tubercule' },
    { produit: 'Riz', prix: 3300, unite: 'kg', variation: '-2%', categorie: 'cereale' },
    { produit: 'Haricot', prix: 4200, unite: 'kg', variation: '+1%', categorie: 'legumineuse' },
    { produit: 'Tomate', prix: 2600, unite: 'kg', variation: '+8%', categorie: 'legume' },
    { produit: 'Oignon', prix: 3000, unite: 'kg', variation: '+2%', categorie: 'legume' },
    { produit: 'Banane plantain', prix: 1400, unite: 'rg', variation: '-2%', categorie: 'fruit' },
    { produit: 'Ananas', prix: 2300, unite: 'pièce', variation: '+1%', categorie: 'fruit' },
  ],
  kisangani: [
    { produit: 'Œufs', prix: 330, unite: 'pièce', variation: '-3%', categorie: 'volaille' },
    { produit: 'Poulet de chair', prix: 8000, unite: 'pièce', variation: '+1%', categorie: 'volaille' },
    { produit: 'Maïs', prix: 2000, unite: 'kg', variation: '+6%', categorie: 'cereale' },
    { produit: 'Manioc', prix: 1600, unite: 'kg', variation: '+2%', categorie: 'tubercule' },
    { produit: 'Riz', prix: 3200, unite: 'kg', variation: '+3%', categorie: 'cereale' },
    { produit: 'Haricot', prix: 4000, unite: 'kg', variation: '-1%', categorie: 'legumineuse' },
    { produit: 'Tomate', prix: 2400, unite: 'kg', variation: '+10%', categorie: 'legume' },
    { produit: 'Oignon', prix: 2800, unite: 'kg', variation: '+3%', categorie: 'legume' },
    { produit: 'Banane plantain', prix: 1300, unite: 'rg', variation: '0%', categorie: 'fruit' },
    { produit: 'Ananas', prix: 2200, unite: 'pièce', variation: '+2%', categorie: 'fruit' },
  ],
  mbujimayi: [
    { produit: 'Œufs', prix: 340, unite: 'pièce', variation: '+1%', categorie: 'volaille' },
    { produit: 'Poulet de chair', prix: 7800, unite: 'pièce', variation: '-2%', categorie: 'volaille' },
    { produit: 'Maïs', prix: 1900, unite: 'kg', variation: '+3%', categorie: 'cereale' },
    { produit: 'Manioc', prix: 1500, unite: 'kg', variation: '+1%', categorie: 'tubercule' },
  ],
  kananga: [
    { produit: 'Œufs', prix: 320, unite: 'pièce', variation: '-1%', categorie: 'volaille' },
    { produit: 'Poulet de chair', prix: 7500, unite: 'pièce', variation: '+2%', categorie: 'volaille' },
    { produit: 'Maïs', prix: 1800, unite: 'kg', variation: '+5%', categorie: 'cereale' },
    { produit: 'Manioc', prix: 1400, unite: 'kg', variation: '+3%', categorie: 'tubercule' },
  ],
  bukavu: [
    { produit: 'Œufs', prix: 360, unite: 'pièce', variation: '+4%', categorie: 'volaille' },
    { produit: 'Poulet de chair', prix: 8300, unite: 'pièce', variation: '+2%', categorie: 'volaille' },
    { produit: 'Maïs', prix: 2300, unite: 'kg', variation: '+3%', categorie: 'cereale' },
    { produit: 'Manioc', prix: 1750, unite: 'kg', variation: '+2%', categorie: 'tubercule' },
  ],
  goma: [
    { produit: 'Œufs', prix: 370, unite: 'pièce', variation: '+5%', categorie: 'volaille' },
    { produit: 'Poulet de chair', prix: 8400, unite: 'pièce', variation: '+3%', categorie: 'volaille' },
    { produit: 'Maïs', prix: 2400, unite: 'kg', variation: '+4%', categorie: 'cereale' },
    { produit: 'Manioc', prix: 1850, unite: 'kg', variation: '+3%', categorie: 'tubercule' },
  ],
  matadi: [
    { produit: 'Œufs', prix: 390, unite: 'pièce', variation: '+6%', categorie: 'volaille' },
    { produit: 'Poulet de chair', prix: 8800, unite: 'pièce', variation: '+4%', categorie: 'volaille' },
    { produit: 'Maïs', prix: 2500, unite: 'kg', variation: '+5%', categorie: 'cereale' },
    { produit: 'Manioc', prix: 1950, unite: 'kg', variation: '+4%', categorie: 'tubercule' },
  ],
}

export const historiquePrix = {
  oeufs: [
    { jour: 'J-6', prix: 320 },
    { jour: 'J-5', prix: 330 },
    { jour: 'J-4', prix: 340 },
    { jour: 'J-3', prix: 350 },
    { jour: 'J-2', prix: 360 },
    { jour: 'J-1', prix: 370 },
    { jour: 'Auj.', prix: 380 },
  ],
}

export const conseilsAgricoles = [
  { id: 1, titre: 'Optimiser la production d\'œufs', categorie: 'Volaille', contenu: 'Pour maximiser la production d\'œufs, assurez-vous que vos poules reçoivent 16 heures de lumière par jour. Une alimentation riche en calcium est essentielle.', icone: '🥚', difficulte: 'facile' },
  { id: 2, titre: 'Gestion de la chaleur', categorie: 'Volaille', contenu: 'En saison chaude, placez des ventilateurs dans le poulailler. La chaleur excessive réduit la production d\'œufs de 20-30%.', icone: '🌡️', difficulte: 'moyen' },
  { id: 3, titre: 'Rotation des cultures', categorie: 'Culture', contenu: 'Alternez le maïs avec des légumineuses pour enrichir naturellement le sol en azote et réduire les maladies.', icone: '🌾', difficulte: 'moyen' },
  { id: 4, titre: 'Stockage des œufs', categorie: 'Conservation', contenu: 'Conservez les œufs pointe en bas à 10-15°C. Ne lavez pas les œufs avant le stockage.', icone: '📦', difficulte: 'facile' },
  { id: 5, titre: 'Vaccination des poules', categorie: 'Santé', contenu: 'Vaccinez vos poules contre la maladie de Newcastle et la bronchite infectieuse.', icone: '💉', difficulte: 'difficile' },
  { id: 6, titre: 'Irrigation au goutte-à-goutte', categorie: 'Culture', contenu: 'Cette technique économise 40-60% d\'eau par rapport à l\'irrigation traditionnelle.', icone: '💧', difficulte: 'difficile' },
  { id: 7, titre: 'Compostage des déchets', categorie: 'Engrais', contenu: 'Transformez les déchets organiques en compost riche pour fertiliser vos champs.', icone: '🍂', difficulte: 'facile' },
  { id: 8, titre: 'Détection précoce des maladies', categorie: 'Santé', contenu: 'Surveillez l\'appétit et l\'activité de vos poules. Une baisse de ponte peut signaler un problème.', icone: '🔍', difficulte: 'moyen' },
]

export const actualitesAgricoles = [
  { id: 1, titre: 'Hausse des prix du maïs à Kinshasa', date: '2024-02-15', resume: 'Les prix du maïs ont augmenté de 8% suite aux fortes pluies qui ont affecté les récoltes.', source: 'Ministère de l\'Agriculture' },
  { id: 2, titre: 'Nouveau programme de subvention pour les éleveurs', date: '2024-02-12', resume: 'Le gouvernement lance un programme d\'aide à l\'achat d\'aliments pour bétail.', source: 'Présidence RDC' },
  { id: 3, titre: 'Formation gratuite : Techniques avicoles modernes', date: '2024-02-10', resume: 'L\'INERA organise des sessions de formation dans 5 provinces.', source: 'INERA' },
]

export const categoriesProduits = [
  { id: 'tous', nom: 'Tous', icone: '📋' },
  { id: 'volaille', nom: 'Volaille', icone: '🐔' },
  { id: 'cereale', nom: 'Céréales', icone: '🌾' },
  { id: 'tubercule', nom: 'Tubercules', icone: '🥔' },
  { id: 'legumineuse', nom: 'Légumineuses', icone: '🫘' },
  { id: 'legume', nom: 'Légumes', icone: '🥬' },
  { id: 'fruit', nom: 'Fruits', icone: '🍌' },
]
