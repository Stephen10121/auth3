import type { AuthenticatorTransportFuture, CredentialDeviceType, Base64URLString } from '@simplewebauthn/types';
import type { RecordModel } from 'pocketbase';


export type UserModel = {
    id: any;
    username: string;
};

/**
 * It is strongly advised that credentials get their own DB
 * table, ideally with a foreign key somewhere connecting it
 * to a specific UserModel.
 *
 * "SQL" tags below are suggestions for column data types and
 * how best to store data received during registration for use
 * in subsequent authentications.
 */
export type Passkey = {
    // SQL: Store as `TEXT`. Index this column
    cred_id: Base64URLString,
    // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
    //      Caution: Node ORM's may map this to a Buffer on retrieval,
    //      convert to Uint8Array as necessary
    cred_public_key: Uint8Array,
    // SQL: Foreign Key to an instance of your internal user model
    internal_user_id: string,
    // SQL: Store as `TEXT`. Index this column. A UNIQUE constraint on
    //      (webAuthnUserID + user) also achieves maximum user privacy
    webauthn_user_id: Base64URLString,
    // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
    counter: number;
    // SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
    // Ex: 'singleDevice' | 'multiDevice'
    device_type: CredentialDeviceType,
    // SQL: `BOOL` or whatever similar type is supported
    backup_status: boolean,
    // SQL: `VARCHAR(255)` and store string array as a CSV string
    // Ex: ['ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb']
    transports?: AuthenticatorTransportFuture[];

};

/**
 * Human-readable title for your website
 */
export const rpName = 'GAuth';
/**
 * A unique identifier for your website. 'localhost' is okay for
 * local dev
 */
export const rpID = 'localhost:5173';
/**
 * The URL at which registrations and authentications should occur.
 * 'http://localhost' and 'http://localhost:PORT' are also valid.
 * Do NOT include any trailing /
 */
export const origin = `http://${rpID}`;