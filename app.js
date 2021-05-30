const fs = require("fs");
const {
  Client: AppStoreConnectClient,
  DownloadSalesReportFrequency,
} = require("@egodigital/appstore-connect");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const zlib = require("zlib");

const config = require("./config.json");

const PRIVATE_KEY = fs.readFileSync("./auth_key.p8");

const CLIENT = new AppStoreConnectClient({
  apiKey: config.apiKey,
  issuerId: config.issuerId,
  privateKey: PRIVATE_KEY,
});

const main = async () => {
  const SUMMARY = await CLIENT.getAppDownloads({
    frequency: DownloadSalesReportFrequency.Daily,
    vendorId: config.vendorId,

    date: "2021-05-01",
  });

  console.log(SUMMARY);
};

const generateToken = async () => {
  const now = Math.round(new Date().getTime() / 1000);
  const after20Mins = now + (60 * 20 - 1);

  const algorithm = "ES256";

  const header = {
    alg: algorithm,
    kid: config.apiKey,
    typ: "JWT",
  };

  const payload = {
    iss: config.issuerId,
    exp: after20Mins,
    aud: "appstoreconnect-v1",
  };

  try {
    const token = jwt.sign(payload, PRIVATE_KEY, { algorithm, header });
    console.log(token);
  } catch (error) {
    console.log(error);
  }
};

const main2 = async (token, params) => {
  const url = `https://api.appstoreconnect.apple.com/v1/salesReports`;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/a-gzip'
    },
    gzip: true,
    params,
  };
  try {
    const r = await axios.get(url, config);
    const { data } = r;
    console.log(r);
    console.log(data);
  } catch (error) {
    console.log(error.response.data);
  }
};

/* generateToken(); */
const token =
  "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5aODYzVlZYNEIifQ.eyJpc3MiOiI2OWE2ZGU4ZC1lM2U2LTQ3ZTMtZTA1My01YjhjN2MxMWE0ZDEiLCJleHAiOjE2MjIzNzY0MzcsImF1ZCI6ImFwcHN0b3JlY29ubmVjdC12MSIsImlhdCI6MTYyMjM3NTIzN30.aZh5_CQQI87H9xuWjNwWq9VVPTQ04xA3MngDOXENx_ufU5Y2AfuxU2s3whzJcwVaPStWj29RDt7oRPdEv8ft9A";

const params = {
  "filter[frequency]": "MONTHLY",
  "filter[reportDate]": "2021-03",
  "filter[reportSubType]": "SUMMARY",
  "filter[reportType]": "SALES",
  "filter[vendorNumber]": config.vendorId,
};
main()
/* main2(token, params); */
/* check(token) */
