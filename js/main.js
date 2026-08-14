import {
    initAuth
} from "./auth.js";

import {
    fetchPeopleData
} from "./dataService.js";

import {
    initVisualization
} from "./visualization.js";


const loginScreen =
    document.getElementById(
        "login-screen"
    );

const visualizationScreen =
    document.getElementById(
        "visualization-screen"
    );

const loadingIndicator =
    document.getElementById(
        "loading-indicator"
    );

const recordCount =
    document.getElementById(
        "record-count"
    );


/* ========================================
   APPLICATION START
======================================== */

initAuth(
    handleLoginSuccess
);


/* ========================================
   LOGIN SUCCESS
======================================== */

async function handleLoginSuccess() {

    showLoading();

    try {

        const people =
            await fetchPeopleData();


        if (
            people.length === 0
        ) {

            throw new Error(
                "No records were found in the Google Sheet."
            );
        }


        updateRecordCount(
            people.length
        );


        console.log(
            `Preparing visualization for ${people.length} people.`
        );


        showVisualization();


        initVisualization(
            people
        );

    }

    catch (error) {

        console.error(
            "Application error:",
            error
        );


        alert(
            "Unable to load the visualization. " +
            "Please check the Google Sheet connection."
        );


        showLogin();

    }

    finally {

        hideLoading();

    }
}


/* ========================================
   RECORD COUNT
======================================== */

function updateRecordCount(
    totalRecords
) {

    recordCount.textContent =
        `${totalRecords} Records • Google Sheet Data`;
}


/* ========================================
   SCREEN MANAGEMENT
======================================== */

function showVisualization() {

    loginScreen.classList.add(
        "hidden"
    );


    visualizationScreen.classList.remove(
        "hidden"
    );
}


function showLogin() {

    visualizationScreen.classList.add(
        "hidden"
    );


    loginScreen.classList.remove(
        "hidden"
    );
}


/* ========================================
   LOADING STATE
======================================== */

function showLoading() {

    loadingIndicator.classList.remove(
        "hidden"
    );
}


function hideLoading() {

    loadingIndicator.classList.add(
        "hidden"
    );
}