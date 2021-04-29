/*
#
# Copyright 2020- IBM Inc. All rights reserved
# SPDX-License-Identifier: Apache2.0
#
*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Quote.css";
import { ArrowLeft32 } from "@carbon/icons-react";
import { Loading } from "carbon-components-react";
import {
  Grid,
  Row,
  Column,
  Button,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableContainer,
  TableBody,
  TableCell,
  Tile,
  Link,
} from "carbon-components-react";
import ContainerComponent from "./../Layout/Container/ContainerComponent";

const parseCookies = (cookies) => {
  let list = {};

  cookies &&
    cookies.split(";").forEach(function (cookie) {
      const parts = cookie.split("=");
      list[parts.shift().trim()] = decodeURI(parts.join("="));
    });

  return list;
};

const hostname =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : window.location.origin;

export default function QuoteComponent(props) {
  const searchParams = new URLSearchParams(props.location.search);
  const ipmConfigID = searchParams.get("ipmConfigID");
  const backLink = searchParams.get("back");

  const [loading, setLoader] = useState({
    status: true,
    msg: "Preparing quote... please wait! ",
  });
  const [config, setConfig] = useState({});
  const [infoObj, setInfo] = useState({ status: null, message: "" });

  const loaderProps = {
    active: true,
    withOverlay: true,
    small: false,
    description: "Loader",
    className: "loader",
  };

  const cookies = parseCookies(document.cookie);
  const { jwttoken } = cookies;

  const headers = {
    Authorization: "Bearer " + jwttoken,
  };

  useEffect(() => {
    getData(hostname);
  }, []);

  const getData = (host) => {
    axios
      .get(`${host}/partner/quote/data?ipmConfigID=` + ipmConfigID, {
        headers,
      })
      .then((response) => {
        if (response.data.errorMessage) {
          setInfo({
            status: "error",
            message: response.data.errorMessage,
            data: response.data,
          });
        } else {
          resetInfo();
          setConfig(response.data);
        }
      })
      .catch((error) => {
        setInfo({
          status: "error",
          message: error.response.data?.errorMessage ? error.response.data.errorMessage : "Something went wrong!",
          data: error,
        });
      })
      .finally(() => {
        closeLoader();
      });
  };

  const closeLoader = () => {
    setLoader({ status: false, msg: "" });
  };

  const resetInfo = () => {
    setInfo({
      status: null,
      message: "",
      data: null,
    });
  };

  const handleCreateOrder = (ipmConfigID) => {
    setLoader({ status: true, msg: "Creating order... please wait!" });

    let url = `${hostname}/partner/product/order/${ipmConfigID}`;
    const orderReferenceNumber = sessionStorage.getItem('or');

    if (orderReferenceNumber) {
      url = `${url}/${orderReferenceNumber}`
    }

    axios
      .post(url, {
        headers,
      })
      .then((response) => {
        if (response.data.errorMessage) {
          setInfo({
            status: "error",
            message: response.data.errorMessage,
            data: response.data,
          });
        } else {
          setInfo({
            status: "success",
            message: response.data.message,
            data: response.data,
          });
        }
      })
      .catch((error) => {
        setInfo({
          status: "error",
          message: error.response.data?.errorMessage ? error.response.data.errorMessage : "Something went wrong!",
          data: error,
        });
      })
      .finally(() => {
        closeLoader();
      });
  };

  const handleRedirectBack = (backLink) => {
      //redirect back
      window.location.assign(backLink);
  };

  const buttonProps = (ipmConfigID) => {
    return {
      disabled: infoObj.status,
      tooltipAlignment: "center",
      style: { float: "right" },
      onClick: () => handleCreateOrder(ipmConfigID),
    };
  };

  const backLinkProps = (backLink) => {
    return {
      className: "back--link",
      inline: true,
      onClick: () => handleRedirectBack(backLink),
    };
  };

  const renderStatusMessages = (info) => {
    if (info.status) {
      switch (true) {
        case info.data.hasOwnProperty("orderReferenceNumber"):
          return (
            <div className={`${info.status}--status info--section`}>
              <span>
                Order number {info.data.orderReferenceNumber} has been created
                succesfully!
              </span>
            </div>
          );
        default:
          return (
            <div className={`${info.status}--status info--section`}>
              <span>{info.message}</span>
            </div>
          );
      }
    } else {
      return null;
    }
  };

  return (
    <ContainerComponent>
      <div className="margin-top25">
        <h3 className="quote--title">
          {loading.status ? loading.msg : "Quote"}
        </h3>
      </div>
      {renderStatusMessages(infoObj)}
      {loading.status ? (
        <Loading {...loaderProps} />
      ) : infoObj.data?.errorCode === "MP1808E" ? null : (
        <Grid>
          {backLink ? <Row>
            <Column md={12} className="margin-top25">
              <Tile light={true}>
                <Link {...backLinkProps(backLink)}>
                  <ArrowLeft32 />
                  <span>Back</span>
                </Link>
              </Tile>
            </Column>
          </Row> : null}
          
          {config.contacts ? (
            <Row>
              <Column sm={12} md={12} lg={12} className="margin-top25">
                <Tile>
                  <h4>Contact</h4>
                </Tile>
              </Column>
              <Column md={2}>
                <Tile light={true}>
                  <span>
                    Name:{" "}
                    {config.contacts.firstName + " " + config.contacts.lastName}
                  </span>
                </Tile>
              </Column>
              <Column md={2}>
                <Tile light={true}>
                  <span>Email: {config.contacts.email} </span>
                </Tile>
              </Column>
            </Row>
          ) : null}

          <>
            {config.provisioning ? (
              <Row>
                <Column sm={12} md={12} lg={12} className="margin-top25">
                  <Tile>
                    <h4>Provision Details</h4>
                  </Tile>
                </Column>
                {Object.keys(config.provisioning).map(
                  (provisionField, index) => (
                    <Column md={2} key={index}>
                      <Tile light={true}>
                        <span>
                          {provisionField}:{config.provisioning[provisionField]}
                        </span>
                      </Tile>
                    </Column>
                  )
                )}
              </Row>
            ) : null}
            <Row>
              <Column sm={12} md={12} lg={12} className="margin-top25">
                <Tile>
                  <h4>Other Details</h4>
                </Tile>
              </Column>
              <Column md={2}>
                <Tile light={true}>
                  <span>IPM Config ID: {config.ipmConfigID}</span>
                </Tile>
              </Column>
              <Column md={2}>
                <Tile light={true}>
                  <span>Billing Terms: {config.billing}</span>
                </Tile>
              </Column>
              <Column md={2}>
                <Tile light={true}>
                  <span>Subscription Terms: {config.terms}</span>
                </Tile>
              </Column>
            </Row>
            <Row>
              <Column>
                <TableContainer className="margin-top25" title="Summary">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>ID</TableHeader>
                        <TableHeader>Quantity</TableHeader>
                        <TableHeader>Partner Debit Price</TableHeader>
                        <TableHeader>Customer Debit Price</TableHeader>
                        <TableHeader>Customer Credit Price</TableHeader>
                        <TableHeader>Price</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {config.items?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.partIdentifier}</TableCell>
                          <TableCell>{item.attributes.item_qty}</TableCell>
                          <TableCell>{item.pricingEstimate?.debit.partnerExtendedPrice}</TableCell>
                          <TableCell>{item.pricingEstimate?.debit.suggestedEndCustomerPrice}</TableCell>
                          <TableCell>{item.pricingEstimate?.credit.partnerExtendedPrice}</TableCell>
                          <TableCell>
                            {item.pricingEstimate?.debit
                              .suggestedEndCustomerPrice
                              ? item.pricingEstimate.debit
                                  .suggestedEndCustomerPrice +
                                " " +
                                config.currency
                              : "Free"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Column>
            </Row>
            <Row className="margin-top25">
              <Column lg={8}></Column>
              <Column lg={2}>
                <span className="total--price">
                  Total price: {config.totalPrice} {config.currency}
                </span>
              </Column>
              <Column lg={2}>
                <Button {...buttonProps(ipmConfigID)}>Create Order</Button>
              </Column>
            </Row>
          </>
        </Grid>
      )}
    </ContainerComponent>
  );
}
