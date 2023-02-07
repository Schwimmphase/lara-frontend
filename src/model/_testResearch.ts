import { Author } from "./Author";
import { Comment } from "./Comment";
import { Tag } from "./Tag";
import { Paper } from "./Paper";
import { SavedPaper } from "./SavedPaper";
import { SaveState } from "./SaveState";
import { Research } from "./Research";
import { User } from "./User";
import { UserCategory } from "./UserCategory";
import { OpenPaper } from "@/stores/model/OpenPaper";


export const testComment1 = new Comment("Das ist der erste Testkommentar");
export const testComment2 = new Comment("Das ist der zweite Testkommentar");
export const testComment3 = new Comment("Das ist der dritte Testkommentar");

export const testResearchComment = new Comment("Das ist der dritte Testkommentar");

export const testUserCategory1 = new UserCategory("id12345", "#32a852", "Cooler Typ");
export const testUserCategory2 = new UserCategory("id67890", "#0000FF", "ADMIN");

export const testUser = new User("Johannes", "id12345", "cool", testUserCategory1);


export const testResearch = new Research("id12345", "Sehr tolle Recherche", new Date(), testResearchComment, testUser);

export const testAuthor = new Author( "Carsten Sinz");

export const testTag1 = new Tag("id12345", "Super wichtig", "#fcba03");
export const testTag2 = new Tag("id12346", "Mega wichtig", "#2980b9");
export const testTag3 = new Tag("id12347", "Ultra wichtig", "#2c3e50");

export const testPaper = new Paper("SemSchol$961fe188f2fe4708a7dbf70057790750252e058c", "An Efficient Branch-and-Bound Solver for Hitting Set", [testAuthor],
    2023, "Das ist der Absrtract eines sehr coolen Papers, das aber keinen Zweck hat sonder nur Test ist.",
    1, 0, "NEG", "https://www.orimi.com/pdf-test.pdf");

export const testSavedPaper1 = new SavedPaper(testPaper, testResearch, testComment1, [testTag1, testTag2, testTag3], 1, SaveState.hidden);
export const testSavedPaper2 = new SavedPaper(testPaper, testResearch, testComment2, [testTag1, testTag2, testTag3], 2, SaveState.hidden);
export const testSavedPaper3 = new SavedPaper(testPaper, testResearch, testComment3, [testTag1, testTag2, testTag3], 0, SaveState.added);
export const testSavedPaper4 = new SavedPaper(testPaper, testResearch, testComment1, [testTag1, testTag2, testTag3], 1, SaveState.enqueued);
export const testSavedPaper5 = new SavedPaper(testPaper, testResearch, testComment2, [testTag1, testTag2, testTag3], 2, SaveState.hidden);
export const testSavedPaper6 = new SavedPaper(testPaper, testResearch, testComment3, [testTag1, testTag2, testTag3], 0, SaveState.added);
export const testSavedPaper7 = new SavedPaper(testPaper, testResearch, testComment1, [testTag1, testTag2, testTag3], 1, SaveState.enqueued);
export const testSavedPaper8 = new SavedPaper(testPaper, testResearch, testComment2, [testTag1, testTag2, testTag3], 2, SaveState.hidden);
export const testSavedPaper9 = new SavedPaper(testPaper, testResearch, testComment3, [testTag1, testTag2, testTag3], 0, SaveState.added);
export const testSavedPaper10 = new SavedPaper(testPaper, testResearch, testComment1, [testTag1, testTag2, testTag3], 1, SaveState.enqueued);
export const testSavedPaper11 = new SavedPaper(testPaper, testResearch, testComment2, [testTag1, testTag2, testTag3], 2, SaveState.hidden);
export const testSavedPaper12 = new SavedPaper(testPaper, testResearch, testComment3, [testTag1, testTag2, testTag3], 0, SaveState.added);

export const testOpenPaper = new OpenPaper(undefined, testSavedPaper1, true);
export const testOpenPaper2 = new OpenPaper(testPaper, undefined, false);

export const testPaperList: Paper[] = [
    testPaper,
    testPaper,
    testPaper,
    testPaper,
    testPaper,
    testPaper,
    testPaper,
    testPaper
];

export const testSavedPaperList: SavedPaper[] = [
    testSavedPaper1,
    testSavedPaper2,
    testSavedPaper3,
    testSavedPaper4,
    testSavedPaper5,
    testSavedPaper6,
    testSavedPaper7,
    testSavedPaper8,
    testSavedPaper9,
    testSavedPaper10,
    testSavedPaper11,
    testSavedPaper12
];