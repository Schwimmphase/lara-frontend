export const messages = {
    en: {
        test: 'This is a small test',

        words: {
            close: 'Close',
            recommendations: 'Recommendations',
            citations: 'Citations',
            references: 'References',
            export: 'Export',
            activate: 'Activate',
            descending: 'descending',
            ascending: 'ascending'
        },
        
        errorMsg: {
            falseLoginData: 'Wrong username oder wrong password'
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
            addTags: 'Add Tags',
            editTag: {
                name: 'Tag name',
            },
            relevance: 'Relevance',
            save: 'Save',
            enqueue: 'Enqueue',
            add: 'Add',
            open: 'Open',
            recommendations: 'Recommendations',
            citations: 'Citations',
            references: 'References',
            bigger: 'Toggle bigger list',
            biggerListEmpty: 'There are no papers to display here',
            more: 'No more papers | One more paper | {n} more papers'
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
                name: 'Category name',
                finish: 'Create',
            },
            organize: {
                userCategories: 'User categories'
            }
        },

        organizers: {
            venue: 'Venue',
            earlier: 'Earlier',
            later: 'Later',
            ascending: 'Ascending',
            descending: 'Descending',
            sortByYear: 'Sort by year',
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
            empty: 'This list is empty. Maybe try adding papers to your research.'
        },

        paperCard: {
            snackbar: {
                enqueued: 'Paper has been added to the list of queued papers',
                hidden: 'Paper was hidden from the research'
            }
        },

        pageTitles: {
            home: 'Home',
            login: 'Login',
            admin: 'Admin',
            recommendations: 'Recommendations',
        }
    },
    
    de: {
        
        words: {
            close: 'Schließen',
            recommendations: 'Empfehlungen',
            citations: 'Zitate',
            references: 'Referenzen',
            export: 'Exportieren'
        },

        errorMsg: {
            falseLoginData: 'Falscher Nutzername oder falsches Passwort'
        },
        
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
            addTags: 'Tags hinzufügen',
            editTag: {
                name: 'Tagname'
            },
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

        organizers: {
            venue: 'Venue',
            earlier: 'Früher',
            later: 'Später',
            ascending: 'Aufsteigend',
            descending: 'Absteigend',
            sortByYear: 'Nach Jahr sortieren',
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

        confirmDialog: {
            message: 'Sind Sie sicher?',
            confirm: 'Bestätigen',
            cancel: 'Abbrechen'
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
            empty: 'Dieser Abschnitt ist zur Zeit leer',
            copied: 'BibTeX-Export wurde zur Zwischenablage hinzugefügt',
            close: 'Schließen'
        },

        recommendationsView: {
            recommended: 'Empfohlen',
            citationsReferences: 'Zitate/Referenzen',
            empty: 'Diese List ist leer. Versuche erst Artikel zu deiner Recherche hionzuzufügen.'
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
