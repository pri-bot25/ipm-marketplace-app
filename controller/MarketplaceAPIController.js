/*
#
# Copyright 2020- IBM Inc. All rights reserved
# SPDX-License-Identifier: Apache2.0
#
*/
"use strict";
var https = require("../util/https");

const marketplaceURL = process.env.SA_URL || "https://dev.api.ibm.com/marketplace/test/v2";
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

exports.getPartnerProducts = async function (locale) {
    var endpoint = "/catalog/reseller/products" + "?locale=" + locale;
    console.log("Executing request to fetch products: ", endpoint);
    const result = await https.executeGetRequest(
        marketplaceURL,
        endpoint,
        clientId,
        clientSecret
    );
    return result;
};

exports.getPartnerProduct = async function (productId) {
    var endpoint = "/catalog/reseller/products/" + productId;

    console.log("Executing request to fetch single product: ", endpoint);
    const result = await https.executeGetRequest(
        marketplaceURL,
        endpoint,
        clientId,
        clientSecret
    );
    return result;
};
