const fs = require("fs");
const {
  Client: AppStoreConnectClient,
  DownloadSalesReportFrequency,
} = require("@egodigital/appstore-connect");

const config = require("./config.json");

const PRIVATE_KEY = fs.readFileSync("./auth_key.p8");

const CLIENT = new AppStoreConnectClient({
  apiKey: config.apiKey,
  issuerId: config.issuerId,
  privateKey: PRIVATE_KEY,
});

const main = async () => {
  const SUMMARY = await CLIENT.getAppDownloads({
    frequency: DownloadSalesReportFrequency.Monthly,
    vendorId: config.vendorId,

    date: "2021-05",
  });

  console.log(SUMMARY);
};

main();
