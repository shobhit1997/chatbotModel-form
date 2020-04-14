const {google} = require('googleapis');

/*******************/
/** CONFIGURATION **/
/*******************/

const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: process.env.GOOGLE_REDIRECT_URL, // this must match your google api settings
};

const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',,
  'https://www.googleapis.com/auth/userinfo.profile'
];

/*************/
/** HELPERS **/
/*************/

function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope
  });
}

function getGooglePlusApi(auth) {
  return google.plus({ version: 'v1', auth });
}

/**********/
/** MAIN **/
/**********/

/**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */
function urlGoogle() {
  const auth = createConnection();
  const url = getConnectionUrl(auth);
  return url;
}

/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
async function getGoogleAccountFromCode(code) {
  const auth = createConnection();
  const data = await auth.getToken(code);
  const tokens = data.tokens;
  auth.setCredentials(tokens);
  const service = google.people({version: 'v1', auth});
  // console.log(await plus.me());
  const me = await service.people.get({
    resourceName: 'people/me',
    personFields: 'names,emailAddresses',
  });
  console.log(me);
  const userGoogleId = me.data.id;
  const userGoogleName = me.data.names && me.data.names.length && me.data.names[0].displayName;
  const userGoogleEmail = me.data.emailAddresses && me.data.emailAddresses.length && me.data.emailAddresses[0].value;
  return {
    name: userGoogleName,
    email: userGoogleEmail,
    authType: 'google',
  };
}

module.exports={urlGoogle,getGoogleAccountFromCode};
