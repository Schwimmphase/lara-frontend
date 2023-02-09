export const messages = {
    en: {
        test: 'This is a small test',

        words: {
            close: 'Close',
            recommendations: 'Recommendations',
            citations: 'Citations',
            references: 'References',
            export: 'Export'
        },

        navbar: {
            logout: 'Logout',
            home: 'Home',
            manageUsers: 'Manage users',
            changeLanguage: 'Change language'
        },

        detailView: {
            abstract: 'Abstract',
            year_venue_timesCited_timesReferenced: '{year} - {venue} - cited {timesCited} times - referenced {timesReferenced} times',
            errorGettingPdf: 'Unfortunately there has been an error!'
        },

        detailSidebar: {
            citationCount: 'No Citations | One Citation | {n} Citations',
            referenceCount: 'No Reference | One Reference | {n} References',
            information: 'Information',
            comments: 'Comments',
            tags: 'Tags',
            relevance: 'Relevance',
            save: 'Save',
            enqueue: 'Enqueue',
            add: 'Add',
            open: 'Open',
            recommendations: 'Recommendations',
            citations: 'Citations',
            references: 'References',
        },

        login: {
            login: 'Login',
            userId: 'User ID',
            password: 'Password',
            button: 'submit'
        },

        admin: {
            createUser: 'Create user',
            editCategories: 'Edit user categories',
            greeting: 'Hello Admin {name}!',
            userOverview: 'User overview',
            editUser: 'Edit user',
            userDialog: {
                username: 'Username',
                passwordNew: 'New password',
                password: 'Password',
                userCategory: 'User category',
                buttonCreate: 'Nutzer erstellen',
                buttonEdit: 'Save'
            },
            categories: {
                manage: 'Manage user categories',
                create: 'Create user category',
                save: 'Save',
                edit: 'Edit user category',
                name: 'Categoryname',
                finish: 'Create',
            },
            organize: {
                userCategories: 'User categories'
            }
        },

        organizers: {
            venue: 'Venue',
        },

        home: {
            greetings: 'Hello {username}!',
            startNewResearch: 'Start new research',
            myResearches: 'My researches',
        },

        researchCard: {
            addedAndEnqueuedPapers: '{added} added, {enqueued} enqueued papers',
            startedOn: 'started on {startedOn}',
            open: 'Open'
        },

        confirmDialog: {
            message: 'Are you sure?',
            confirm: 'Confirm',
            cancel: 'Cancel'
        },

        newResearchDialog: {
            title: 'Title',
            description: 'Description'
        },

        researchOverview: {
            overview: 'Overview',
            globalSearch: 'Search',
            enqueued: 'Enqueued',
            hidden: 'Hidden',
            export: 'Export',
            empty: 'This section is currently empty',
            copied: 'BibTeX export was added to the clipboard',
            close: 'Close'
        },

        organizableList: {
            organizeButton: 'Organize',
            filterSettings: 'Filter settings',
        },

        researchOverviewCard: {
            add: 'Add'
        },

        sidebar: {
            searchBar: 'Search...',
            recommendationsButton: 'Recommendations',
            returnButton: 'Return',
            enqueued: 'enqueued',
            added: 'added',
            hidden: 'hidden'
        },

        researchEditDialog: {
            title: 'Title',
            description: 'Description',
            save: 'Save changes'
        },

        recommendationsView: {
            recommended: 'Recommended',
            citationsReferences: 'Citations/References',
        },

        paperCard: {
            snackbar: {
                enqueued: 'Paper has been added to the list of queued papers',
                hidden: 'Paper was hidden from the research'
            }
        }
    },
    
    de: {
        test: 'Das ist ein kleiner Test!',
        
        detailView: {
            abstract: 'Abstract',
            year_venue_timesCited_timesReferenced: '{year} - {venue} - {timesCited} mal zitiert - {timesReferenced} mal referenziert',
            errorGettingPdf: 'Leider ist ein Fehler aufgetreten!'
        },

        navbar: {
            logout: 'Abmelden',
            home: 'Start',
            manageUsers: 'Nutzer verwalten',
            changeLanguage: 'Sprache ändern'
        },

        detailSidebar: {
            citationCount: 'Keine Zitate | Ein Zitat | {n} Zitate',
            referenceCount: 'Keine Referenzen | Eine Referenz | {n} Referenzen',
            information: 'Informationen',
            comments: 'Kommentare',
            tags: 'Tags',
            relevance: 'Relevanz',
            save: 'Speichern',
            enqueue: 'Merken',
            add: 'Hinzufügen',
            open: 'Öffnen',
            recommendations: 'Empfehlungen',
            citations: 'Zitationen',
            references: 'Referenzen',
        },

        login: {
            login: 'Anmelden',
            userId: 'Nutzer-ID',
            password: 'Passwort',
            button: 'anmelden'
        },

        admin: {
            createUser: 'Nutzer anlegen',
            editCategories: 'Nutzerkategorien verwalten',
            greeting: 'Hallo Admin {name}!',
            userOverview: 'Nutzerübersicht',
            editUser: 'Nutzer bearbeiten',
            editDialog: {
                username: 'Nutzername',
                passwordNew: 'Neues Passwort',
                password: 'Passwort',
                userCategory: 'Nutzerkategorie',
                buttonCreate: 'Nutzer erstellen',
                buttonEdit: 'Speichern'
            },
            categories: {
                manage: 'Nutzerkategorien verwalten',
                create: 'Nutzerkategorie erstellen',
                save: 'Speichern',
                edit: 'Nutzerkategorie bearbeiten',
                name: 'Name der Kategorie',
                finish: 'Erstellen',
            },
            organize: {
                userCategories: 'Nutzerkategorien'
            }
        },

        home: {
            greetings: 'Hallo {username}!',
            startNewResearch: 'Neue Recherche starten',
            myResearches: 'Meine Recherchen',
        },

        researchCard: {
            addedAndEnqueuedPapers: '{added} hinzugefügte, {enqueued} gemerkte Artikel',
            startedOn: 'gestartet am {startedOn}',
            open: 'Öffnen'
        },

        newResearchDialog: {
            title: 'Titel',
            description: 'Beschreibung'
        },

        researchOverview: {
            overview: 'Übersicht',
            globalSearch: 'Suche',
            enqueued: 'Für später gemerkt',
            hidden: 'Ausgeblendet',
            export: 'Exportieren',
            empty: 'Dieser Abschied ist zur Zeit leer',
            copied: 'BibTeX-Export wurde zur Zwischenablage hinzugefügt',
            close: 'Schließen'
        },

        organizableList: {
            organizeButton: 'Organisieren',
            filterSettings: 'Filtereinstellungen'
        },

        researchOverviewCard: {
            add: 'Hinzufügen'
        },

        sidebar: {
            searchBar: 'Suche...',
            recommendationsButton: 'Empfehlungen',
            returnButton: 'Zurück',
            enqueued: 'gemerkt',
            added: 'hinzugefügt',
            hidden: 'ausgeblendet'
        },

        researchEditDialog: {
            title: 'Titel',
            description: 'Beschreibung',
            save: 'Änderungen speichern'
        }
    }
}
