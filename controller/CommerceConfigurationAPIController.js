/*
#
# Copyright 2020- IBM Inc. All rights reserved
# SPDX-License-Identifier: Apache2.0
#
*/
"use strict";

const https = require("../util/https");

const commerceConfigurationURL = process.env.CCP_API || "https://wwwstage.ibm.com/marketplace/purchase/configuration";
const commerceConfigurationAPIURL = commerceConfigurationURL + "/api/v1";

exports.getEditionIdByPlan = async function (planId) {
    let editionId;

    const endpoint = "/editions?thirdPartyPlanID=" + planId;

    const result = await https.executeGetRequestWithoutHeaders(
        commerceConfigurationAPIURL,
        endpoint
    );

    try {
        editionId = result[0].editionID;
    } catch (exception) {
        editionId = null;
    }

    return editionId;
};

exports.getCheckOutURL = function (editionId) {
    return commerceConfigurationURL + "/en/us/checkout?editionID=" + editionId;
};
