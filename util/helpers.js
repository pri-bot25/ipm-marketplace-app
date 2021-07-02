/*
#
# Copyright 2020- IBM Inc. All rights reserved
# SPDX-License-Identifier: Apache2.0
#
*/
"use strict";

exports.parseCookies = (cookies) => {
  let list = {};

  cookies &&
    cookies.split(";").forEach(function (cookie) {
      const parts = cookie.split("=");
      list[parts.shift().trim()] = decodeURI(parts.join("="));
    });

  return list;
};
