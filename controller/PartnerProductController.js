/*
#
# Copyright 2020- IBM Inc. All rights reserved
# SPDX-License-Identifier: Apache2.0
#
*/
"use strict";

let marketplaceAPIController = require("./MarketplaceAPIController");
let commerceConfigurationAPIController = require("./CommerceConfigurationAPIController");

const axios = require("axios");
const helpers = require("../util/helpers");

/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
exports.redirectCCP = async function (req, res, next) {
    const cookies = helpers.parseCookies(req.headers.cookie);
    const { redirectURL, jwttoken } = cookies;
    if (redirectURL && jwttoken) {
        const url = decodeURIComponent(redirectURL);
        res.redirect(url + "&tk=" + jwttoken);
    }
};

/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
exports.getPartnerProductsData = async function (req, res, next) {
    var products = await marketplaceAPIController.getPartnerProducts("en-us");
    res.send({ products: products });
};

/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
exports.getPlansByPartnerProductId = async function (req, res, next) {
    const partnerProductId = req.params.productId;
    await marketplaceAPIController.getPartnerProduct(partnerProductId);
};

/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
exports.createOrder = async function (req, res, next) {
    const { ipmConfigID, orderReferenceNumber } = req.params;

    const host = process.env.SA_URL || "https://dev.api.ibm.com/marketplace/test/v2";;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    const headers = {
        "Content-Type": "application/json",
        "X-IBM-Client-Id": clientId,
        "X-IBM-Client-Secret": clientSecret
    };

    const postData = {
        orderType: "3PM",
        ipmConfigId: ipmConfigID,
        licenseAcceptance: {
            firstName: "3PM",
            lastName: "IpmConfigTestUser_4",
            dateTime: 123456789,
            email: "3PMIpmConfigTestUser_4@yopmail.com",
        },
    };

    const requestUrl = `${host}/reseller/orders`;
    let reqPromise;

    if (orderReferenceNumber) {
        reqPromise = axios.put(
            `${requestUrl}/${orderReferenceNumber}`,
            postData,
            { headers }
        );
    } else {
        postData.contacts = [
            {
                type: "END_CUSTOMER",
                addressLine1: "1225 Long Pond Rd",
                city: "Rochester",
                postalCode: "14626",
                state: "NY",
                country: "USA",
                communicationLanguage: "EN",
                isTelco: false
            }
        ];

        reqPromise = axios.post(requestUrl, postData, { headers });
    }
    reqPromise
        .then((response) => {
            res.send(response.data);
        })
        .catch((err) => {
            console.log(err, "error 2");
            if (err.response.data.hasOwnProperty("httpMessage")) {
                const { httpMessage, httpCode } = err.response.data;

                res.send({ errorMessage: httpMessage, errorCode: httpCode });
            } else {
                const { errorMessage, errorCode } = err.response.data;
                res.send({ errorMessage, errorCode });
            }
        });
};

/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
exports.getPartnerProducts = async function (req, res, next) {
    console.log("Querying the product for the user");
    var products = await marketplaceAPIController.getPartnerProducts("en-us");
    var productNames = [];
    for (var product of products) {
        productNames.push(product.name);
    }
    res.render("products", { products: products });
};

/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
exports.getPlansByPartnerProductIdData = async function (req, res, next) {
    var partnerProductId = req.params.productId;

    var product = await marketplaceAPIController.getPartnerProduct(
        partnerProductId
    );

    var purchasePlans = product.purchasePlans;
    res.send({ plans: purchasePlans, mainID: product.id });
};

/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
exports.getPlansByPartnerProductId = async function (req, res, next) {
    const partnerProductId = req.params.productId;
    console.log(
        "Querying plans for the productId ",
        JSON.stringify(partnerProductId)
    );

    try {
        var product = await marketplaceAPIController.getPartnerProduct(
            partnerProductId
        );
        if (product) {
            res.status(200).send(product);
        }
    } catch (error) {
        console.log(error);
    }
};

/**
 * @param  {} params
 * @param  {} query
 * @param  {} buymore
 */
exports.getToken = async function (params, query, buymore) {
    const { productId, planId, orderReferenceNumber } = params;
    const postData = {
        orderType: "3PM",
        product: {
            id: productId,
            planId: planId,
        },
    };

    if (buymore) {
        postData.orderReferenceNumber = orderReferenceNumber;
    } else {
        postData.countryCode = query.countryCode || "USA";
    }

    const marketplaceURL = process.env.SA_URL || "https://dev.api.ibm.com/marketplace/test/v2";
    const requestUrl = `${marketplaceURL}/reseller/orders/configuration`;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const headers = {
        "Content-Type": "application/json",
        "X-IBM-Client-Id": clientId,
        "X-IBM-Client-Secret": clientSecret,
    };

    return axios.post(requestUrl, postData, {
        headers,
    });
};

/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
exports.configurePartnerProduct = async function (req, res, next) {
    if (req.hasOwnProperty("params")) {
        try {
            const token = await module.exports.getToken(req.params, req.query);

            if (token.status === 200) {
                const jwttoken = token.data.token.value;
                const target = req.headers.origin + "/partner/quote";

                const headers = {
                    "Access-Control-Expose-Headers": "Authorization",
                    Authorization: "Bearer " + jwttoken,
                };

                const commerceConfigurationURL = process.env.CCP_API || "https://wwwstage.ibm.com/marketplace/purchase/configuration";
                // Get redirectURL from CCP
                const redirectURL = await axios.get(
                    `${commerceConfigurationURL}/api/v1/jwt/ipm/checkout-url?target=${target}`,
                    {
                        headers,
                    }
                );

                res.cookie("jwttoken", jwttoken);
                res.cookie("redirectURL", redirectURL.data.responseUrl);
                res.send({
                    redirectUrl:
                        redirectURL.data.responseUrl + "&tk=" + jwttoken,
                });
            }
        } catch (err) {
            console.log(err, "err");
            res.send({ redirectUrl: false, err });
        }
    }
};

/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
exports.configureLocalProduct = async function (req, res, next) {
    const reseller = "reseller=true";
    const path = "/partner/purchase/configuration/en/us/checkout";
    const referer = req.headers.referer;

    const planId = req.params.planId;

    const editionId = await commerceConfigurationAPIController.getEditionIdByPlan(
        planId
    );

    const url = `${path}?editionID=${editionId}&${reseller}&target=${referer}`;

    res.redirect(url);
};

/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
exports.getSubscriptionsByUserId = async function (req, res, next) {
    if (req.hasOwnProperty("params")) {
        try {
            const { userId } = req.params;
            const clientId = process.env.CLIENT_ID;
            const clientSecret = process.env.CLIENT_SECRET;
            const marketplaceURL = process.env.SA_URL || "https://dev.api.ibm.com/marketplace/test/v2";

            const headers = {
                "Content-Type": "application/json",
                "X-IBM-Client-Id": clientId,
                "X-IBM-Client-Secret": clientSecret,
            };

            axios
                .get(`${marketplaceURL}/subscriptions?email=${userId}`, {
                    headers,
                })
                .then((response) => {
                    if (response.status === 200) {
                        res.status(200).send(response.data.data);
                    }
                })
                .catch((error) => console.log("error>>", error, "<<error"));
        } catch (err) {
            console.log(err);
            res.status(500).send({ message: "Error", err });
        }
    } else {
        res.status(500).send({ message: "Missing params!" });
    }
};

/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
exports.buyMore = async function (req, res, next) {
    if (req.hasOwnProperty("params")) {
        try {
            const { currentURL } = req.body;
            const target = req.headers.origin + "/partner/quote";
            const token = await module.exports.getToken(
                req.params,
                req.query,
                true
            );

            if (token.status === 200) {
                const jwttoken = token.data.token.value;
                const url = process.env.URL;
                const redirectUrl = `${url}/en/us/checkout/ipm/buy-more?tk=${jwttoken}&back=${currentURL}&target=${target}`;

                res.send({ redirectUrl });
            }
        } catch (err) {
            console.log(err.response.data);
            res.status(500).send({
                redirectUrl: false,
                err: err.response.data,
            });
        }
    }
};

/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
exports.configureProductQuoteData = async function (req, res, next) {
    const reqQuery = req.query;

    if (reqQuery.hasOwnProperty("ipmConfigID")) {
        const ipmConfigID = reqQuery.ipmConfigID;
        const host = process.env.SA_URL || "https://dev.api.ibm.com/marketplace/test/v2";
        const requestUrl = `${host}/reseller/orders/configuration/${ipmConfigID}?includePricingEstimates=true`;

        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const headers = {
            "Content-Type": "application/json",
            "X-IBM-Client-Id": clientId,
            "X-IBM-Client-Secret": clientSecret,
        };

        axios
            .get(requestUrl, {
                headers,
            })
            .then((response) => {
                let totalPrice = 0;
                for (let k in response.data.lineItems) {
                    const el = response.data.lineItems[k];
                    if (el.pricingEstimate) {
                        totalPrice +=
                            el.pricingEstimate.debit.partnerExtendedPrice;
                    }
                }

                res.send({
                    contacts: response.data.contacts
                        ? response.data.contacts[0]
                        : [],
                    currency: response.data.currency,
                    items: response.data.lineItems,
                    provisioning: response.data.provisioningConfigs
                        ? response.data.provisioningConfigs.provisiongDetails
                        : null,
                    ipmConfigID: ipmConfigID,
                    totalPrice: totalPrice,
                    billing:
                        response.data.billingFrequency === "U"
                            ? "Up Front"
                            : "",
                    terms: response.data.term
                        ? response.data.term + " month"
                        : "none",
                });
            })
            .catch((error) => {
                const { errorMessage, errorCode } = error.response.data;
                res.status(500).send({ errorMessage, errorCode });
            });
    }
};
