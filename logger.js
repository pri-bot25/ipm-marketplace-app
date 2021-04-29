/*
#
# Copyright 2020- IBM Inc. All rights reserved
# SPDX-License-Identifier: Apache2.0
#
*/
let Logger = require('node-logentries');
const logger = Logger.logger({
  token: process.env.LOGENTRIES_TOKEN,
});

module.exports = logger;