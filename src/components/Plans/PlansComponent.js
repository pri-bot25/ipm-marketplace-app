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
    InlineNotification,
    Loading,
} from "carbon-components-react";

import ContainerComponent from "./../Layout/Container/ContainerComponent";

import "./Plans.css";

export default function PlansComponent(props) {
    const [plans, setPlans] = useState([]);
    const [loading, setLoader] = useState(true);
    const [spinner, setSpinner] = useState(false);
    const [clickedButton, setClickedButton] = useState("");
    const [error, setError] = useState(false);
    const [productName, setProductName] = useState("");

    const urlProductID = props.match.params.productID;
    const headers = ["Product", "Description", ""];

    const hostname =
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : window.location.origin;

    useEffect(() => getPlans(), []);

    /**
     */
    const getPlans = () => {
        axios
            .get(`${hostname}/partner/product/${urlProductID}/plans/data`)
            .then((response) => {
                setLoader(false);
                if (response.data) {
                    const plans = response.data.plans.filter((data) => {
                        if(data.hasOwnProperty("supportedByIbmConfigurator") && data["supportedByIbmConfigurator"]=== true)
                          {
                              return data.hasOwnProperty("id");
                         }
                    });
                    setPlans(plans);
                }
            })
            .catch((err) => console.log(err));
    };

    /**
     * @param  {} product
     * @param  {} buttonId
     */
    const redirectToPurchase = (product, buttonId) => {
        setProductName(product.name);
        setClickedButton(buttonId);
        setError(false);
        setSpinner(true);

        //order reference number not used on purchase flow,
        // if there are any ORN left in session from previous subscrition actions... - remove them
        sessionStorage.removeItem("or");

        axios
            .post(
                `${hostname}/partner/product/${urlProductID}/configure/${product.id}/${navigator.language}`
            )
            .then((res) => {
                if (res.data.redirectUrl) {
                    window.open(res.data.redirectUrl);
                } else {
                    setError(true);
                }
                setSpinner(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    /**
     * @param  {} product
     */
    const buttonProps = (product) => {
        return {
            size: "small",
            tooltipAlignment: "center",
            onClick: () => redirectToPurchase(product, product.id + "_PB"),
            className: "purchase-button",
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

    const notificationProps = () => ({
        kind: "error",
        lowContrast: false,
        role: "alert",
        title: productName + " is not supported.",
        subtitle: "Please try again.",
        iconDescription: "describes the close button",
        statusIconDescription: "describes the status icon",
        hideCloseButton: false,
        onCloseButtonClick: () => onCloseButtonClick(),
    });

    const onCloseButtonClick = () => setError(false);

    return (
        <ContainerComponent>
            {error && <InlineNotification {...notificationProps()} />}

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
                                            <Button {...buttonProps(plan)}>
                                                Purchase{" "}
                                                {spinner &&
                                                    plan.id + "_PB" ===
                                                        clickedButton && (
                                                        <Loading
                                                            {...loadingProps()}
                                                            className={
                                                                "some-class"
                                                            }
                                                        />
                                                    )}
                                            </Button>
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
