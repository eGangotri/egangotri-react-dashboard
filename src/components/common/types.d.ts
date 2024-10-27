
export interface DecodedJWT {
    iss?: string;
    sub?: string;
    aud?: string;
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
    [key: string]: any; // This allows for additional custom claims
}