/*
#
# Copyright 2020- IBM Inc. All rights reserved
# SPDX-License-Identifier: Apache2.0
#
*/
"use strict";

var express = require("express");
var router = express.Router();

let partnerProductController = require("../controller/PartnerProductController");

/* GET Partner Products. data */
router.get("/products/data", partnerProductController.getPartnerProductsData);

/* GET Partner Product Plans data. */
router.get(
    "/product/:productId/plans/data",
    partnerProductController.getPlansByPartnerProductIdData
);

/* GET Partner Product Plans. */
router.post(
    "/product/:productId/plans",
    partnerProductController.getPlansByPartnerProductId
);

/* GET Subscriptions */
router.get(
    "/product/subscriptions/:userId",
    partnerProductController.getSubscriptionsByUserId
);

/* POST Buy More */
router.post(
    "/product/:productId/buymore/:planId/:orderReferenceNumber",
    partnerProductController.buyMore
);

/* POST Configure Partner Product Punchout */
router.post(
    "/product/:productId/configure/:planId/:language",
    partnerProductController.configurePartnerProduct
);

/* POST Local checkout*/
router.post(
    "/local/product/:productId/configure/:planId",
    partnerProductController.configureLocalProduct
);

router.post(
    "/product/redirect/:ipmConfigID",
    partnerProductController.redirectCCP
);

router.post(
    "/product/order/:ipmConfigID/:orderReferenceNumber",
    partnerProductController.createOrder
);

router.post(
    "/product/order/:ipmConfigID",
    partnerProductController.createOrder
);

router.get("/product/order/:ipmConfigID", partnerProductController.createOrder);

router.get("/quote/data", partnerProductController.configureProductQuoteData);

module.exports = router;
