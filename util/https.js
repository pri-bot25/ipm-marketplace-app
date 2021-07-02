/*
#
# Copyright 2020- IBM Inc. All rights reserved
# SPDX-License-Identifier: Apache2.0
#
*/
'use strict';

var fetch = require('node-fetch');

exports.executeGetRequestWithoutHeaders = async function (host, endpoint) {
  var url = host + endpoint;
  var result = await fetch(url, {
    method: 'GET',
  }).then(response => { return response.json(); });
  return result;
};

exports.executeGetRequest = async function (host, endpoint, clientId, clientSecret) {
  var url = host + endpoint;
  var result = await fetch(url, {
    method: 'GET',
    headers: {
      'x-ibm-client-id': clientId,
      'x-ibm-client-secret': clientSecret,
    },
  }).then(response => { return response.json(); });
  return result.data;
};
