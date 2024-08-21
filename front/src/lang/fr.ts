export const fr = {
    translation: {
        title: {
            home: 'Accueil',
            folders: 'Dossiers',
            files: 'Fichiers',
            auth: {
                sign_in_to_tour_account: 'Connectez-vous à votre compte',
                register: 'Créer un compte',
            },
            profile: {
                edit_password: 'Modifier le mot de passe',
                edit: 'Modifier le profil',
            },
            modal: {
                move_media: 'Déplacer le média',
                share_media: 'Partager le média',
                create_folder: 'Créer un dossier',
                delete_media: 'Supprimer le média',
                delete_media_message: 'Êtes-vous sûr de vouloir supprimer ce média ?',
                delete_folder: 'Supprimer le dossier',
                edit_media: 'Modifier le média',
                edit_folder: 'Modifier le dossier',
                delete_share: "Voulez-vous vraiment supprimer ce partage ?",
            },
            admin: {
                dashboard: 'Tableau de bord',
                users: 'Utilisateurs',
                settings: 'Paramètres',
                logs: 'Logs',
                shares: 'Partages',

                user: {
                    create: 'Créer un utilisateur',
                    edit: 'Modifier mon utilisateur',
                    delete: {
                        title: 'Supprimer mon utilisateur',
                        message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
                    },
                },
            },
            nav: {
                dashboard: 'Dashboard',
                users: 'Utilisateurs',
                settings: 'Paramètres',
                logs: 'Logs',
                shares: 'Partages',
                profile: 'Profil',
                logout: 'Déconnexion',
                create_folder: 'Créer un dossier',

                sub: {
                    menu: 'Menu',
                    administration: 'Administration',
                }
            }
        },

        input: {
            label: {
                email: 'Email',
                password: 'Mot de passe',
                password_confirm: 'Confirmer le mot de passe',
                password_optional: 'Mot de passe (optionnel)',
                name: 'Nom',
                duration: 'Durée',
                path: 'Chemin',
                permissions: 'Permissions',
                file_path: 'Chemin racine',
                username: 'Nom d\'utilisateur',
                optional_password: 'Mot de passe (optionnel)',
                share_duration: 'Durée du partage',
            },
            placeholder: {
                email: 'john.doe@exemple.com',
                path: 'dossier/',
                name: 'John Doe',
                password: '********',
                file_path: 'dossier/',
                share_duration: 'Durée du partage',
            },
            options: {
                shares: {
                    hours: 'Heures',
                    days: 'Jours',
                    weeks: 'Semaines',
                    months: 'Mois',
                    years: 'Années',
                }
            }
        },

        alerts: {
            success: {
                folder: {
                    create: 'Dossier créé avec succès',
                    delete: 'Dossier supprimé avec succès',
                    share: 'Dossier partagé avec succès',
                    move: 'Dossier déplacé avec succès',
                },
                user: {
                    create: 'Utilisateur créé avec succès',
                    delete: 'Utilisateur supprimé avec succès',
                    edit: 'Utilisateur modifié avec succès',
                },
                profile: {
                    edit: 'Profil modifié avec succès',
                    edit_password: 'Mot de passe modifié avec succès',
                },
                shares: {
                    create: "Votre partage a été créé avec succès",
                    delete: "Votre partage a été supprimé avec succès",
                }
            },
            error: {
                auth: {
                    login: 'L\'email ou mot de passe incorrect',
                    register: 'Erreur lors de l\'inscription',
                },
            }
        },

        button: {
            add: 'Ajouter',
            delete: 'Supprimer',
            edit: 'Modifier',
            create: 'Créer',
            save: 'Enregistrer',
            cancel: 'Annuler',
            login: 'Connexion',
            register: 'Inscription',
            move: 'Déplacer',
            close: 'Fermer',
            share: 'Partager',
        },

        table: {
            name: 'Nom',
            email: 'Email',
            permissions: 'Permissions',
            file_path: 'Chemin racine',
            created_at: 'Créé le',
            actions: 'Actions',
            user: 'Utilisateur',
            subject: 'Sujet',
            path: 'Chemin',
            expires_at: 'Expire le',
            expired_at: 'Expire le',
            no_data: 'Aucune donnée disponible',
        },

        tooltip: {
            delete: 'Supprimer',
            edit: 'Modifier',
            share: 'Partager',
            move: 'Déplacer',
            download: 'Télécharger',
            upload: 'Téléverser',
            copy: 'Copier',
            eye: 'Voir',
        },
    }
}