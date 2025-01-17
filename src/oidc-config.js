import {UserManager, WebStorageStateStore} from "oidc-client";

const oidcConfig = {
    authority: "http://localhost:8080/realms/gwas", // Replace with your IdP URL
    client_id: "curation", // Replace with your client ID
    popup_redirect_uri: "http://localhost:8081", // Replace with your app's redirect URI
    response_type: "id_token token", // Or "id_token token" based on your flow
    scope: "openid profile email", // Include required scopes
    userStore: new WebStorageStateStore({ store: window.localStorage })
};

export const userManager = new UserManager(oidcConfig);
