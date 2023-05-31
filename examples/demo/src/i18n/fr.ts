import { TranslationMessages } from 'ra-core';
import frenchMessages from 'ra-language-french';

const customFrenchMessages: TranslationMessages = {
    ...frenchMessages,
    pos: {
        search: 'Rechercher',
        configuration: 'Configuration',
        language: 'Langue',
        theme: {
            name: 'Theme',
            light: 'Clair',
            dark: 'Obscur',
        },
        dashboard: {
            monthly_revenue: 'CA à 30 jours',
            month_history: "Chiffre d'affaire sur 30 jours",
            new_orders: 'Nouvelles commandes',
            pending_reviews: 'Commentaires à modérer',
            new_customers: 'Nouveaux clients',
            pending_orders: 'Commandes à traiter',
            order: {
                items:
                    'par %{customer_name}, un poster |||| par %{customer_name}, %{nb_items} posters',
            },
            welcome: {
                title: 'Bienvenue sur la démo e-commerce de react-admin',
                subtitle:
                    "Ceci est le back-office d'un magasin de posters imaginaire. N'hésitez pas à explorer et à modifier les données. La démo s'exécute en local dans votre navigateur, et se remet à zéro chaque fois que vous rechargez la page.",
                aor_button: 'Site web de react-admin',
                demo_button: 'Code source de cette démo',
            },
        },
        menu: {
            sales: 'Ventes',
            catalog: 'Catalogue',
            customers: 'Clients',
        },
    },
    resources: {
        customers: {
            name: 'Client |||| Clients',
            fields: {
                address: 'Rue',
                birthday: 'Anniversaire',
                city: 'Ville',
                commands: 'Commandes',
                first_name: 'Prénom',
                first_seen: 'Première visite',
                groups: 'Segments',
                has_newsletter: 'Abonné à la newsletter',
                has_ordered: 'A commandé',
                last_name: 'Nom',
                last_seen: 'Vu le',
                last_seen_gte: 'Vu depuis',
                latest_purchase: 'Dernier achat',
                name: 'Nom',
                total_spent: 'Dépenses',
                zipcode: 'Code postal',
                password: 'Mot de passe',
                confirm_password: 'Confirmez le mot de passe',
            },
            filters: {
                last_visited: 'Dernière visite',
                today: "Aujourd'hui",
                this_week: 'Cette semaine',
                last_week: 'La semaine dernière',
                this_month: 'Ce mois-ci',
                last_month: 'Le mois dernier',
                earlier: 'Plus tôt',
                has_ordered: 'A déjà commandé',
                has_newsletter: 'Abonné newsletter',
                group: 'Segment',
            },
            fieldGroups: {
                identity: 'Identité',
                address: 'Adresse',
                stats: 'Statistiques',
                history: 'Historique',
                password: 'Mot de passe',
                change_password: 'Changer le mot de passe',
            },
            page: {
                delete: 'Supprimer le client',
            },
            errors: {
                password_mismatch:
                    'La confirmation du mot de passe est différent du mot de passe.',
            },
        },
        commands: {
            name: 'Commande |||| Commandes',
            amount: '1 commande |||| %{smart_count} commandes',
            title: 'Commande n°%{reference}',
            fields: {
                basket: {
                    delivery: 'Frais de livraison',
                    reference: 'Référence',
                    quantity: 'Quantité',
                    sum: 'Sous-total',
                    tax_rate: 'TVA',
                    total: 'Total',
                    unit_price: 'P.U.',
                },
                customer_id: 'Client',
                date_gte: 'Emises depuis',
                date_lte: 'Emises avant',
                nb_items: 'Nb articles',
                reference: 'Référence',
                returned: 'Annulée',
                status: 'Etat',
                total_gte: 'Montant minimum',
            },
        },
        invoices: {
            name: 'Facture |||| Factures',
            fields: {
                id: 'Numéro',
                date: 'Date de facture',
                customer_id: 'Client',
                command_id: 'Commande',
                date_gte: 'Emises depuis',
                date_lte: 'Emises avant',
                address: 'Adresse',
                total_ex_taxes: 'Montant HT',
                delivery_fees: 'Frais de livraison',
                taxes: 'TVA',
            },
        },
        products: {
            name: 'Poster |||| Posters',
            fields: {
                category_id: 'Catégorie',
                height_gte: 'Hauteur mini',
                height_lte: 'Hauteur maxi',
                height: 'Hauteur',
                image: 'Photo',
                price: 'Prix',
                reference: 'Référence',
                stock_lte: 'Stock faible',
                stock: 'Stock',
                thumbnail: 'Aperçu',
                width_gte: 'Largeur mini',
                width_lte: 'Margeur maxi',
                width: 'Largeur',
            },
            tabs: {
                image: 'Image',
                details: 'Détails',
                description: 'Description',
                reviews: 'Commentaires',
            },
            filters: {
                categories: 'Catégories',
                stock: 'Stock',
                no_stock: 'En rupture',
                low_stock: 'Stock bas',
                enough_stock: 'Normal',
                sales: 'Ventes',
                best_sellers: 'Meilleures ventes',
                average_sellers: 'Moyennes',
                low_sellers: 'Peu vendu',
                never_sold: 'Jamais vendu',
            },
        },
        categories: {
            name: 'Catégorie |||| Catégories',
            fields: {
                name: 'Nom',
                products: 'Produits',
            },
        },
        reviews: {
            name: 'Commentaire |||| Commentaires',
            amount: '1 commentaire |||| %{smart_count} commentaires',
            relative_to_poster: 'Commentaire sur',
            detail: 'Détail du commentaire',
            fields: {
                customer_id: 'Client',
                command_id: 'Commande',
                product_id: 'Produit',
                date_gte: 'Publié depuis',
                date_lte: 'Publié avant',
                date: 'Date',
                comment: 'Texte',
                status: 'Statut',
                rating: 'Classement',
            },
            action: {
                accept: 'Accepter',
                reject: 'Rejeter',
            },
            notification: {
                approved_success: 'Commentaire approuvé',
                approved_error: 'Erreur: Commentaire non approuvé',
                rejected_success: 'Commentaire rejeté',
                rejected_error: 'Erreur: Commentaire non rejeté',
            },
        },
        segments: {
            name: 'Segment |||| Segments',
            fields: {
                customers: 'Clients',
                name: 'Nom',
            },
            data: {
                compulsive: 'Compulsif',
                collector: 'Collectionneur',
                ordered_once: 'A commandé',
                regular: 'Régulier',
                returns: 'A renvoyé',
                reviewer: 'Commentateur',
            },
        },
    },
};

export default customFrenchMessages;
