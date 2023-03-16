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
            ascending: 'ascending',
            research: 'Research',
            hide: 'Hide',
            remove: 'Remove',
            delete: 'Delete',
            edit: 'Edit',
        },
        
        errorMsg: {
            falseLoginData: 'Wrong username oder wrong password',
            global: {
                wrongInput: 'Error: {message}',
                notAuthenticated: 'Unexpected error: you are not authenticated',
                notAuthorized: 'Unexpected error: you are not authorized to perform this action',
                internalServerError: 'Unexpected error: internal server error',
                unknownError: 'Unexpected error: unknown error',
                couldNotParseData: 'Unexpected error: could not parse data from server'
            }
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
            biggerListEmpty: 'There are no papers to display here',
            errorGettingPdf: 'Unfortunately there has been an error while loading the PDF!'
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
            more: 'No more papers | One more paper | {n} more papers'
        },

        login: {
            login: 'Login',
            username: 'Username',
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
            description: 'Description',
            cancel: 'Cancel'
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
            hidden: 'hidden',
            expand: 'Expand sidebar',
            collapse: 'Collapse sidebar',
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
            export: 'Exportieren',
            activate: 'Aktivieren',
            descending: 'absteigend',
            ascending: 'aufsteigend',
            research: 'Recherche',
            hide: 'Ausblenden',
            remove: 'Entfernen',
            delete: 'Löschen',
            edit: 'Bearbeiten',
        },

        errorMsg: {
            falseLoginData: 'Falscher Nutzername oder falsches Passwort',
            global: {
                wrongInput: 'Fehler: {message}',
                notAuthenticated: 'Unerwarteter Fehler: Sie sind nicht angemeldet',
                notAuthorized: 'Unerwarteter Fehler: Sie sind nicht berechtigt, diese Aktion auszuführen',
                internalServerError: 'Unerwarteter Fehler: Interner Serverfehler',
                unknownError: 'Unerwarteter Fehler: unbekannter Fehler',
                couldNotParseData: 'Unerwarteter Fehler: Daten vom Server konnten nicht verarbeitet werden',
            }
        },

        navbar: {
            logout: 'Abmelden',
            home: 'Start',
            manageUsers: 'Nutzer verwalten',
            changeLanguage: 'Sprache ändern'
        },
        
        detailView: {
            abstract: 'Zusammenfassung',
            year_venue_timesCited_timesReferenced: '{year} - {venue} - {timesCited} mal zitiert - {timesReferenced} mal referenziert',
            biggerListEmpty: 'Hier sind keine Artikel, die angezeigt werden können',
            errorGettingPdf: 'Leider ist ein Fehler aufgetreten beim Laden der PDF!'
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
            bigger: 'Schalte größere Liste um',
            more: 'Keine weiteren Artikel | Ein weiterer Artikel | {n} weitere Artikel'
        },

        login: {
            login: 'Anmelden',
            username: 'Nutzername',
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
            hidden: 'ausgeblendet',
            expand: 'Seitenleiste ausklappen',
            collapse: 'Seitenleiste einklappen',
        },

        researchEditDialog: {
            title: 'Titel',
            description: 'Beschreibung',
            save: 'Änderungen speichern'
        },

        recommendationsView: {
            recommended: 'Empfohlen',
            citationsReferences: 'Zitate/Referenzen',
            empty: 'Diese List ist leer. Versuche erst Artikel zu deiner Recherche hionzuzufügen.'
        },

        paperCard: {
            snackbar: {
                enqueued: 'Paper has been added to the list of queued papers',
                hidden: 'Paper was hidden from the research'
            }
        },

        pageTitles: {
            home: 'Startseite',
            login: 'Login',
            admin: 'Admin',
            recommendations: 'Empfehlungen',
        }
    }
}
