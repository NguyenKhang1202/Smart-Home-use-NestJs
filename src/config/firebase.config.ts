const firebaseConfig = {
  apiKey: 'AIzaSyDN-A2m9of-MX_0PoO7acIttgi_6brO7bQ',
  authDomain: 'smart-home-nestjs.firebaseapp.com',
  projectId: 'smart-home-nestjs',
  storageBucket: 'smart-home-nestjs.appspot.com',
  messagingSenderId: '851619920497',
  appId: '1:851619920497:web:629fff48128d008af2b9d0',
  measurementId: 'G-7TD8J34S13',
  clientEmail:
    'firebase-adminsdk-51dms@smart-home-nestjs.iam.gserviceaccount.com',
  privateKey:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCwn6sVPvFxWX/C\nqiWlIIfQ3rmdbb+amuMH9dsIY6N2wg3HJiUIuMDMK+jNqS3NgXTx7NiA44I1fe1L\n5QINMbNEj7dHO7oCBdn+3EoFlrPbkavh3NkotKGspckxwee1865lMsox4V3uXxvt\nLt7alCzz+0yStd0rnHobmPgpQiN9Umw68o1Mg8SyO03QMX63wxtg3po83oomU1JT\nF0NTw/VneiFDbEZ2HxN0bgPFVUbCRsTOy/6ma08rH2aZgQpm8oOluQs63hY2f7SS\nJv1xzaqCa0Befkeksh6ci5XOhMeuBsJhNRSXH9CCWJNoo4ZYYZYldnDApezX0SGs\nazaUKHzvAgMBAAECggEAS3sY6p35IedNLbx4FQ8Ha9BbQ7ecvC44GvVLM1UdjQmW\nSMb46bbHEhorxgRoYhxShXch+UcBJOoZiKcoTsowIftHKKaSMf4dMQkkiynh2FJz\nQbWXiolTVIyPJHgJFZ27qFzhwxpcgZvcu+qda40KfwQkr8gP6mzXVEb1uvAcaZgj\njkeHQl41tRAIeBOWP+NoeOw/F7k/X60aPK8KPyz/tFMpFhyATnPs/bTk/d3pz5+5\nIHyz7oi/V55Fasz6F3MGjNjTpoe8D6+vfHwbQh1kABHUJY9ULSZfx+7stzukdlND\nVvhWQiOrLe7ZD/OMWIBo6OVfLqRhIWGcDiAe7mtTjQKBgQDWorRQ2ybVBoxi/lzz\nT+txRJNE4SYeOmkR7Q5vNpD490K3SPxyl0ELcjcah7R2brqFFEKBiVTESyIfaPoh\nM6jAIydflTxLkoNqdRZzC08BiWQ3uZsWTcNeVmrFh8jRXNMGeT9+ogECG7y70RQj\nNg9xznhwSrra6DqtQdrIs55/1QKBgQDSqZrDnLUGtgvaIgE8+NXWcpdorm70Y3ed\nBAYfpyq0upfcHLCQuJJKMEYo+XNjjh6IyTkCFzfg8Tj6dIYBzEB2nhUxHdasLSKU\n6G7sGaU6GZd8n4k2Xx85KYROOaH7vN1qQLAvZKgm1VXeKBwu8kpOC3GzTBKoxL6S\nlQBhYukvswKBgELVYR54TywwINDGcb0V2rNnbhAZp5vsBkGdtkvtCtFrdOvLn0gz\nTv64bu4k6Y2jRxMfTuI1GB8TYimzr4ddJaPGjoEV4DOMCL3Cfd4O3GgXFwy/D8qv\nJjGe6RpfAKoopFE0ug+9dGDqsCcvoHyiXcbLSvd0XaDChVrj0bODMsyNAoGAYu0y\nuFmGyTgEKNN/MVrJUINPhuEjSbDMIvgYyBSAgY5+cecnI08Jo703tVYvUbkTrbiR\nBOJSY1fkIflGVOHOA+YInaAdh41KiBL+w/DnHnmWIffpP5c72mQctX9rCgSPFa57\nDkZ+kH3ubPz4/zLYof3Nzx0SRh7eP4epPhJs3vECgYEAuU+gGKHcaWxyGTzPQJMe\nbUlP7C3/KjyH1oJZQlXkeZZKqLQ6Ga8/FT+Bd4zIaPfb887SeWHj2McOiMMifbT2\nMWgU5zcMzIGfDnkTIv+YzkRwPuHMIRAI2lTfN+5J3vykJpcENb5P/m0qtnp1mnuE\nGDxtZudTGngzDUF8rsKTtjA=\n-----END PRIVATE KEY-----\n',
};
let appFirebase;
async function setupFirebase(admin) {
  appFirebase = admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: 'https://smart-home-nestjs-default-rtdb.firebaseio.com/',
  });
  return appFirebase;
}

async function getAppFirebase() {
  return appFirebase;
}
export { setupFirebase, getAppFirebase };
