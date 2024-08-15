import { Logger } from 'zeed'
import { Fido2Lib } from "fido2-lib";
const log = console.log // Logger('demo')

/*
log('Hello World')
log.info('Info')
log.warn('Warning')
log.error('Error')
*/

const f2l = new Fido2Lib({
    timeout: 42,
    rpId: "example.com",
    rpName: "ACME",
    rpIcon: "https://example.com/logo.png",
    challengeSize: 128,
    attestation: "none",
    cryptoParams: [-7, -257],
    authenticatorAttachment: "platform",
    authenticatorRequireResidentKey: false,
    authenticatorUserVerification: "required"
});

f2l.enableExtension("appid");

//console.log(f2l)
const registrationOptions = await f2l.attestationOptions();


log(JSON.stringify(registrationOptions))
