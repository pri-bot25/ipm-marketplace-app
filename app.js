/*
#
# Copyright 2020- IBM Inc. All rights reserved
# SPDX-License-Identifier: Apache2.0
#
*/
"use strict";
require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var stackTrace = require("stack-trace");

var partnerProductRouter = require("./routes/PartnerProductRoute.js");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "build")));

app.use("/partner", partnerProductRouter);

app.get("/*", function (req, res) {
    res.set("Cache-Control", "private, max-age=0");
    res.sendFile(path.join(__dirname, "./build/index.html"), function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        console.log("Error occured 404 for req", JSON.stringify(req));
        next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = err;

        if (!err.message) {
            console.log("Error message: ", JSON.stringify(err.message));
            console.log(
                "Error stack trace: ",
                JSON.stringify(stackTrace.parse(err))
            );
        }

        // render the error page
        res.status(err.status || 500);
        res.render("error");
    });
});

module.exports = app;
