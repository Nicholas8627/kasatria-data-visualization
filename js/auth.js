let loginSuccessHandler = null;


/* ========================================
   AUTH INITIALIZATION
======================================== */

/**
 * Registers the function that should run
 * after Google Sign-In succeeds.
 *
 * @param {Function} onSuccess
 */
export function initAuth(onSuccess) {

    loginSuccessHandler =
        onSuccess;


    /*
     * Google Identity Services calls
     * this function by name from HTML.
     *
     * Because this file is an ES module,
     * expose it through window.
     */

    window.handleCredentialResponse =
        handleCredentialResponse;
}


/* ========================================
   GOOGLE SIGN-IN CALLBACK
======================================== */

/**
 * Called automatically by
 * Google Identity Services.
 *
 * @param {Object} response
 */
function handleCredentialResponse(
    response
) {

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


    if (
        typeof loginSuccessHandler ===
        "function"
    ) {

        loginSuccessHandler(
            response
        );
    }
}