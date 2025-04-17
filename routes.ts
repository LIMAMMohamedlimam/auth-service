/**
 * Routes accessible by public wihtout authentication
 */

export const publicRoutes = [
    "/",
    
];

/**
 * Authentication routes
 */


export const authRoutes = [
    "/auth/login",
    "/auth/register",

];

/**
 * API authenticaiton prefix 
 */

export const apiAuthPrefix = "/api/auth" ;

/**
 * Default redirect route after login in 
 */

export const DEFAULT_LOGIN_REDIRECT = "/settings"

