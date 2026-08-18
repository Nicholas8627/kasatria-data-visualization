import {
    CSS3DObject
} from
"three/addons/renderers/CSS3DRenderer.js";


/**
 * Creates one CSS3D tile
 * from a person's data.
 *
 * @param {Object} person
 * @returns {CSS3DObject}
 */
export function createPersonTile(
    person
) {

    const element =
        document.createElement(
            "article"
        );


    element.className =
        `person-tile ${getNetWorthClass(person.netWorth)}`;


    const metaRow =
        createMetaRow(
            person
        );


    const photoWrapper =
        createPhoto(
            person
        );


    const name =
        createTextElement(
            "div",
            "tile-name",
            person.name ||
            "Unknown"
        );


    const interest =
        createTextElement(
            "div",
            "tile-interest",
            person.interest ||
            "-"
        );


    const worth =
        createTextElement(
            "div",
            "tile-worth",
            person.netWorth ||
            "$0"
        );


    element.append(
        metaRow,
        photoWrapper,
        name,
        interest,
        worth
    );


    return new CSS3DObject(
        element
    );
}


/* ========================================
   META ROW
======================================== */

function createMetaRow(
    person
) {

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "tile-meta";


    const country =
        createTextElement(
            "span",
            "tile-country",
            person.country ||
            "-"
        );


    const age =
        createTextElement(
            "span",
            "tile-age",

            person.age
                ? `Age ${person.age}`
                : "Age -"
        );


    row.append(
        country,
        age
    );


    return row;
}


/* ========================================
   PHOTO
======================================== */

function createPhoto(
    person
) {

    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "tile-photo-wrapper";


    const image =
        document.createElement(
            "img"
        );


    image.className =
        "tile-photo";


    image.src =
        person.photo ||
        "";


    image.alt =
        person.name
            ? `${person.name} photo`
            : "Person photo";


    image.loading =
        "lazy";


    image.referrerPolicy =
        "no-referrer";


    image.addEventListener(
        "error",
        () => {

            handleBrokenImage(
                image,
                person.name
            );

        }
    );


    wrapper.appendChild(
        image
    );


    return wrapper;
}


/* ========================================
   BROKEN IMAGE PLACEHOLDER
======================================== */

function handleBrokenImage(
    image,
    name
) {

    const placeholder =
        document.createElement(
            "div"
        );


    placeholder.className =
        "tile-photo tile-photo-placeholder";


    placeholder.textContent =
        getInitials(
            name
        );


    image.replaceWith(
        placeholder
    );
}


/* ========================================
   INITIALS
======================================== */

function getInitials(name) {

    if (!name) {

        return "?";
    }


    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(
            word =>
                word
                    .charAt(0)
                    .toUpperCase()
        )
        .join("");
}


/* ========================================
   GENERIC TEXT ELEMENT
======================================== */

function createTextElement(
    tagName,
    className,
    text
) {

    const element =
        document.createElement(
            tagName
        );


    element.className =
        className;


    element.textContent =
        text;


    return element;
}


/* ========================================
   NET WORTH COLOR
======================================== */

function getNetWorthClass(
    value
) {

    const amount =
        parseNetWorth(
            value
        );


    if (
        amount >
        200000
    ) {

        return "net-worth-high";
    }


    if (
        amount >=
        100000
    ) {

        return "net-worth-medium";
    }


    return "net-worth-low";
}


/* ========================================
   NET WORTH PARSER
======================================== */

export function parseNetWorth(
    value
) {

    if (!value) {

        return 0;
    }


    const text =
        String(
            value
        )
            .trim()
            .toUpperCase();


    let multiplier =
        1;


    if (
        text.includes(
            "M"
        )
    ) {

        multiplier =
            1_000_000;

    }

    else if (
        text.includes(
            "K"
        )
    ) {

        multiplier =
            1_000;
    }


    const number =
        Number.parseFloat(
            text.replace(
                /[^0-9.]/g,
                ""
            )
        );


    if (
        Number.isNaN(
            number
        )
    ) {

        return 0;
    }


    return (
        number *
        multiplier
    );
}