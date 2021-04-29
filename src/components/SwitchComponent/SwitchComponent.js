/*
#
# Copyright 2020- IBM Inc. All rights reserved
# SPDX-License-Identifier: Apache2.0
#
*/
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    Button,
    TableContainer,
    DataTableSkeleton,
    Loading,
    InlineNotification,
} from "carbon-components-react";

import ContainerComponent from "./../Layout/Container/ContainerComponent";

import "./Switch.css";

export default function SwitchComponent(props) {
    const [plans, setPlans] = useState([]);
    const [loading, setLoader] = useState(true);
    const [spinner, setSpinner] = useState(false);
    const [error, setError] = useState({ status: false, message: "" });
    const [productName, setProductName] = useState("");

    const urlUuid = props.match.params.uuid;
    const urlPlanId = props.match.params.planId;
    const urlOrderReferenceNumber = props.match.params.orderReferenceNumber;

    const headers = ["Product", "Description", ""];

    const hostname =
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : window.location.origin;
    const currentURL = window.location.href;

    useEffect(() => {
        getPlans();
    }, []);

    const getPlans = () => {
        axios
            .get(`${hostname}/partner/product/${urlUuid}/plans/data`)
            .then((response) => {
                setLoader(false);

                if (response.data) {
                    setPlans(response.data.plans);
                }
            })
            .catch((error) => {
                console.error(error);
                setError({
                    status: true,
                    message:
                        error.err?.errorMessage || "Something went wrong!!!",
                });
            });
    };

    /**
     * @param  {} product
     * Generate CCP url
     */
    const redirectToBuyMore = (product) => {
        setProductName(product.name);

        sessionStorage.setItem("or", urlOrderReferenceNumber);

        axios
            .post(
                `${hostname}/partner/product/${urlUuid}/buymore/${product.id}/${urlOrderReferenceNumber}`, //buyMore
                { currentURL }
            )
            .then((res) => {
                if (res.data.redirectUrl) {
                    window.open(res.data.redirectUrl);
                } else {
                    setError({
                        status: true,
                        message:
                            res?.data?.err?.errorMessage ||
                            "Something went wrong!!!",
                    });
                }
                setSpinner(false);
            })
            .catch((error) => {
                setError({
                    status: true,
                    message:
                        error.response?.data.err?.errorMessage ||
                        "Something went wrong!!!",
                });
            });
    };

    const buttonPropsBuyMore = (product) => {
        return {
            size: "small",
            tooltipAlignment: "center",
            onClick: () => redirectToBuyMore(product),
            className: "buy-more-button",
        };
    };

    const skeletTableProps = () => ({
        headers,
        columnCount: 3,
        rowCount: 20,
        zebra: true,
        compact: false,
        showHeader: true,
        showToolbar: false,
    });

    const loadingProps = () => ({
        active: spinner,
        withOverlay: false,
        small: true,
        description: "",
    });

    const notificationProps = (error) => ({
        kind: "error",
        className: "switch-error",
        lowContrast: false,
        role: "alert",
        title: productName + " - " + error.message,
        subtitle: "Please try again or contact support if the error persists.",
        iconDescription: "describes the close button",
        statusIconDescription: "describes the status icon",
        hideCloseButton: false,
        onCloseButtonClick: () => onCloseButtonClick(),
    });

    const onCloseButtonClick = () => setError({ status: false, message: "" });

    return (
        <ContainerComponent>
            {error.status && (
                <InlineNotification {...notificationProps(error)} />
            )}

            {loading ? (
                <>
                    <div style={{ width: "auto" }}>
                        <DataTableSkeleton {...skeletTableProps()} />
                        <br />
                    </div>
                </>
            ) : (
                <>
                    <TableContainer
                        title='Plans'
                        description='Click configure to build desired configuration and order.'
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableHeader key={header}>
                                            {header}
                                        </TableHeader>
                                    ))}
                                    <TableHeader></TableHeader>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {plans.map((plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell>{plan.name}</TableCell>
                                        <TableCell>
                                            {plan.description}
                                        </TableCell>

                                        <TableCell>
                                            {urlPlanId === plan.id ? (
                                                "Current plan"
                                            ) : (
                                                <Button
                                                    {...buttonPropsBuyMore(
                                                        plan
                                                    )}
                                                >
                                                    Select{" "}
                                                    {spinner && (
                                                        <Loading
                                                            {...loadingProps()}
                                                            className={
                                                                "some-class"
                                                            }
                                                        />
                                                    )}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </ContainerComponent>
    );
}
