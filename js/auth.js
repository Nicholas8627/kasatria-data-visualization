/* ========================================
   GOOGLE CLIENT ID
======================================== */

const CLIENT_ID =
    "761390105894-3jdklcrgf192sccqk77vtmci68964t6o.apps.googleusercontent.com";



/* ========================================
   AUTH STATE
======================================== */

let loginSuccessHandler =
    null;



/* ========================================
   AUTH INITIALIZATION
======================================== */

/**
 * Starts Google Sign-In.
 *
 * The onSuccess function is provided
 * by main.js.
 *
 * @param {Function} onSuccess
 */
export function initAuth(
    onSuccess
) {

    loginSuccessHandler =
        onSuccess;


    /*
     * Google Identity Services
     * loads asynchronously.
     *
     * Therefore we wait until
     * window.google is ready.
     */

    waitForGoogleIdentity()
        .then(
            initializeGoogleSignIn
        )
        .catch(
            handleGoogleLoadError
        );
}



/* ========================================
   WAIT FOR GOOGLE LIBRARY
======================================== */

/**
 * Waits until the Google Identity
 * Services JavaScript library has loaded.
 *
 * @param {number} timeout
 * @returns {Promise<void>}
 */
function waitForGoogleIdentity(
    timeout = 10000
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const startTime =
                Date.now();


            const timer =
                setInterval(
                    () => {


                        /*
                         * Check whether the
                         * Google Identity API
                         * is available.
                         */

                        const googleReady =
                            window.google &&
                            window.google.accounts &&
                            window.google.accounts.id;


                        if (
                            googleReady
                        ) {

                            clearInterval(
                                timer
                            );


                            resolve();


                            return;
                        }



                        /*
                         * Stop waiting after
                         * the timeout period.
                         */

                        const elapsed =
                            Date.now() -
                            startTime;


                        if (
                            elapsed >
                            timeout
                        ) {

                            clearInterval(
                                timer
                            );


                            reject(
                                new Error(
                                    "Timed out waiting for Google Identity Services."
                                )
                            );
                        }


                    },
                    100
                );

        }
    );
}



/* ========================================
   GOOGLE SIGN-IN INITIALIZATION
======================================== */

/**
 * Initializes Google Identity Services
 * and renders the Google Sign-In button.
 */
function initializeGoogleSignIn() {

    const buttonContainer =
        document.getElementById(
            "google-signin-button"
        );


    if (
        !buttonContainer
    ) {

        console.error(
            "Google Sign-In button container was not found."
        );


        return;
    }



    /*
     * Configure Google Identity Services.
     */

    google.accounts.id.initialize({

        client_id:
            CLIENT_ID,


        callback:
            handleCredentialResponse,


        auto_select:
            false

    });



    /*
     * Render the Google Sign-In button.
     */

    google.accounts.id.renderButton(

        buttonContainer,

        {

            type:
                "standard",


            theme:
                "outline",


            size:
                "large",


            text:
                "signin_with",


            shape:
                "rectangular",


            logo_alignment:
                "left"

        }

    );


    console.log(
        "Google Sign-In initialized."
    );
}



/* ========================================
   GOOGLE LOGIN CALLBACK
======================================== */

/**
 * Runs after Google Sign-In succeeds.
 *
 * @param {Object} response
 */
function handleCredentialResponse(
    response
) {

    /*
     * Google should return
     * an ID token inside:
     *
     * response.credential
     */

    if (
        !response ||
        !response.credential
    ) {

        console.error(
            "Google Sign-In failed: " +
            "No credential received."
        );


        return;
    }



    console.log(
        "Google Sign-In successful."
    );



    /*
     * Tell main.js that
     * login was successful.
     */

    if (
        typeof loginSuccessHandler ===
        "function"
    ) {

        loginSuccessHandler(
            response
        );

    }

    else {

        console.error(
            "Login success handler is not available."
        );

    }
}



/* ========================================
   GOOGLE LOAD ERROR
======================================== */

function handleGoogleLoadError(
    error
) {

    console.error(
        "Google Identity Services failed to load:",
        error
    );


    alert(
        "Google Sign-In could not be loaded. " +
        "Please refresh the page and try again."
    );
}