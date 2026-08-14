const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQwGt4tZcfxPb6I_CLLO0_3dNDy04kOQamWLZiDJmfzVU0CWzVYkx5RjTYfsKTQ70WTqMBzPeRIdLZj/pub?output=csv";


/**
 * Fetches the published Google Sheet
 * and converts the CSV into JavaScript objects.
 *
 * @returns {Promise<Array>}
 */
export async function fetchPeopleData() {

    const response = await fetch(SHEET_URL);

    if (!response.ok) {
        throw new Error(
            `Failed to fetch Google Sheet: ${response.status}`
        );
    }

    const csvText = await response.text();

    const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim()
    });


    if (result.errors.length > 0) {
        console.warn(
            "CSV parsing warnings:",
            result.errors
        );
    }


    const people = result.data
        .filter(isValidPerson)
        .slice(0, 200)
        .map(normalizePerson);


    console.log(
        `Loaded ${people.length} records from Google Sheet.`
    );

    return people;
}


/**
 * Checks whether a CSV row contains
 * the minimum data required for a tile.
 *
 * @param {Object} person
 * @returns {boolean}
 */
function isValidPerson(person) {

    return Boolean(
        person &&
        person.Name &&
        person.Name.trim()
    );
}


/**
 * Converts CSV strings into a consistent
 * data structure for the visualization.
 *
 * @param {Object} person
 * @returns {Object}
 */
function normalizePerson(person) {

    return {
        name: cleanText(person.Name),

        photo: cleanText(person.Photo),

        age: cleanText(person.Age),

        country: cleanText(person.Country),

        interest: cleanText(person.Interest),

        netWorth: cleanText(
            person["Net Worth"]
        )
    };
}


/**
 * Safely converts a value into
 * a trimmed string.
 *
 * @param {*} value
 * @returns {string}
 */
function cleanText(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value).trim();
}