import React, { useEffect } from "react";

// This was written to mimic the behaviour of AAP which used to post message events, I used storage events
// As message events didn't work after a redirect to the idp, as it fails to reference the opener (null)
const PopupCallback = () => {
    useEffect(() => {
        // Function to parse URL hash parameters
        const parseHashParams = (hash) => {
            const params = {};
            hash.substring(1).split("&").forEach((pair) => {
                const [key, value] = pair.split("=");
                params[key] = decodeURIComponent(value);
            });
            return params;
        };

        // Handle the callback
        const handleCallback = () => {
            if (window.location.hash) {
                const hashParams = parseHashParams(window.location.hash);
                const token = hashParams.access_token;
                if (token) {
                    // Send tokens to the parent window
                    localStorage.setItem("tokenEvent", token);
                } else {
                    localStorage.setItem("tokenEvent", undefined);
                }

                // Close the popup
                window.close();
            }
        };

        handleCallback();
    }, []);

    return  <div style={{marginTop: '300px'}}>Processing login...</div>;
};

export default PopupCallback;
