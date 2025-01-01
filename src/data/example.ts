import { inputSchema } from "@/models/schema";
import { z } from "zod";

export const biasExamples: z.infer<typeof inputSchema>[] = [
  {
    context: "Évaluation développeuse senior",
    content: `Evaluation de performance 2023

Forces :
- Excellente dans le soutien aux équipes
- Très appréciée pour son écoute et sa douceur
- Gère naturellement bien plusieurs projets en parallèle 

Axes de développement :
- Doit travailler sa force de conviction en réunion technique
- Manque parfois de fermeté dans les décisions stratégiques
- Pourrait montrer plus d'ambition dans sa progression
- Tendance à privilégier le consensus sur l'efficacité`,
    sensitivity: "high",
  },
  {
    context: "Email marketing cosmétiques pro",
    content: `Nouvelle gamme Excellence Pro

DELICATE (pour elle)
Un soin délicat pour les femmes d'affaires qui veulent rester féminines au travail
- Formule douce et non agressive
- Look naturel et discret
- Prix de lancement : 69€

BOSS (pour lui) 
Le choix des vrais leaders qui imposent leur présence
- Formule concentrée haute performance
- Look puissant
- Prix de lancement : 89€

Des prix adaptés à chaque profil.`,
    sensitivity: "high",
  },
  {
    context: "Description startup",
    content: `Notre équipe de choc :

Direction technique : Pierre et Thomas, deux génies de la tech qui dirigent notre innovation produit avec audace.

Marketing : Marie apporte sa touche de créativité et sa sensibilité naturelle pour comprendre les utilisateurs.

Design : Sophie met sa douceur naturelle au service d'interfaces intuitives.

Développement : Notre team de codeurs aguerris repousse les limites techniques.

RH : Julie s'occupe avec bienveillance du bien-être de nos équipes.`,
    sensitivity: "high",
  },
  {
    context: "Offre d'emploi cabinet conseil",
    content: `Nous recherchons de nouveaux talents !

Profil Business Developer :
- Excellent leadership pour gérer les négociations complexes 
- Grande capacité d'analyse et esprit stratégique
- Rémunération attractive à la hauteur de vos ambitions
- Avantages : salle de sport, club business

Profil Office Manager :
- Sens inné de l'organisation
- Bienveillance naturelle pour gérer l'équipe
- Package adapté à vos besoins
- Avantages : conciergerie, coin détente`,
    sensitivity: "high",
  },
  {
    context: "Newsletter RH",
    content: `Formations Management 2024

Pour les managers confirmés :
"Leadership et Impact" 
- Imposer sa vision stratégique
- Gérer une équipe avec autorité
- Négociation et prise de décision
Tarif préférentiel : 2000€

Pour les jeunes managers :
"Communication et Soft Skills"
- Créer un environnement bienveillant
- Écoute active et empathie
- Gestion des émotions en équipe
Tarif adapté : 1200€`,
    sensitivity: "high",
  },
];
