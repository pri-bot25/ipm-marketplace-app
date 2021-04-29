/*
#
# Copyright 2020- IBM Inc. All rights reserved
# SPDX-License-Identifier: Apache2.0
#
*/
import React, { useState } from "react";
import ContainerComponent from "./../Layout/Container/ContainerComponent";
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
    Loading,
    TextInput,
    Row,
    Column,
    DataTable,
    TableExpandHeader,
    TableExpandRow,
    TableExpandedRow,
    InlineNotification,
} from "carbon-components-react";
import uuid from "uuid/v4";
import "./Subscriptions.css";

export default function SubscriptionsComponent(props) {
    const {
        subscriptions,
        setSubscriptions,
        rows,
        setRows,
        timestamp,
        setTimestamp,
    } = props;

    const [error, setError] = useState({ status: false, message: "" });
    const [userId, setUserId] = useState("ipm@mailinator.com");
    const [spinner, setSpinner] = useState(false);

    React.useEffect(() => {
        const currentTimestamp = Date.now();
        const timeDiff = currentTimestamp - timestamp;

        if (timestamp === 0) {
            setTimestamp(currentTimestamp);
        }

        //if >= than five minutes do request
        if (timeDiff >= 300000) {
            console.log("timestamp expired");
            setTimestamp(currentTimestamp);
            requestSubscriptions();
        } else {
            if (subscriptions.length) {
                setSubscriptions(subscriptions);
            }
            if (rows.length) {
                setRows(rows);
            }
        }
    }, []);

    const hostname =
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : window.location.origin;
    const currentURL = window.location.href;

    const headers = [
        {
            key: "name",
            header: "Name",
        },
        {
            key: "order-reference-number",
            header: "Order reference number",
        },
    ];

    const updateButtonProps = (id) => {
        return {
            size: "small",
            tooltipAlignment: "center",
            onClick: () => {
                setError({ status: false, message: "" });
                handleBuyMore(id);
            },
            className: "buy-more-button",
        };
    };

    const goButtonProps = () => {
        return {
            size: "field",
            tooltipAlignment: "center",
            onClick: () => requestSubscriptions(),
            className: "buy-more-button",
        };
    };

    /**
     * @param  {} planId
     */
    const switchButtonProps = (id) => {
        return {
            onClick: () =>
                props.history.push(
                    `/partner/${id.split("/")[2]}/${id.split("/")[0]}/${
                        id.split("/")[1]
                    }/switch`
                ),
            size: "small",
            tooltipAlignment: "center",

            className: "purchase-button",
        };
    };

    const emailInput = (e) => setUserId(e.target.value);

    /**
     * @param  {} planId
     */
    const handleBuyMore = (planId) => {
        const subscription = subscriptions.filter(
            (data) => data.product.planId === planId
        );

        sessionStorage.setItem(
            "or",
            subscription[0].order.orderReferenceNumber
        );

        if (subscription.length) {
            axios
                .post(
                    `${hostname}/partner/product/${subscription[0].product.uuid}/buymore/${planId}/${subscription[0].order.orderReferenceNumber}`,
                    { currentURL }
                )
                .then((response) => {
                    if (response.status === 200) {
                        window.open(response.data.redirectUrl);
                    }
                })
                .catch((err) => {
                    setError({
                        status: true,
                        message:
                            err.response?.data.err?.errorMessage ||
                            "Something went wrong!!!",
                    });
                });
        }
    };

    /**
     * @param  {} uid
     */
    const getPlanName = async (uid) => {
        return axios.post(`${hostname}/partner/product/${uid}/plans`);
    };

    /**
     */
    const requestSubscriptions = async () => {
        setSpinner(true);
        setRows([]);

        try {
            const response = await axios.get(
                `${hostname}/partner/product/subscriptions/${userId}`
            );

            if (response.status === 200) {
                if (response.data && response.data.length) {
                    const subs = response.data;

                    const promiseKeys = [];
                    const promises = [];
                    let dataTableRows = [];

                    const groupedSubscriptions = subs.reduce(function (
                        acc,
                        obj
                    ) {
                        const uuid = obj.product.uuid;

                        if (!promiseKeys.includes(uuid)) {
                            promiseKeys.push(uuid);
                            promises.push(getPlanName(uuid));
                        }

                        const key = obj.order.orderReferenceNumber;

                        if (!acc[key]) {
                            acc[key] = [];
                        }
                        acc[key].push(obj);

                        return acc;
                    },
                    {});

                    Promise.all(promises).then((plans) => {
                        plans = plans.map((planData) => planData.data);

                        for (let k in groupedSubscriptions) {
                            const element = groupedSubscriptions[k];
                            const rowName = plans.find(
                                (data) => data.id === element[0].product.uuid
                            );

                            dataTableRows = [
                                ...dataTableRows,
                                {
                                    id:
                                        element[0].product.planId +
                                        "/" +
                                        k +
                                        "/" +
                                        element[0].product.uuid,
                                    name: rowName.name,
                                },
                            ];
                        }
                        setRows(dataTableRows);
                    });
                }

                setSpinner(false);
                setSubscriptions(response.data);
                setTimestamp(Date.now());
            }
        } catch (err) {
            console.log(err);
        }
    };

    const loadingProps = () => ({
        className: "loading-spinner",
        active: spinner,
        withOverlay: false,
        small: false,
        description: "",
    });

    const notificationProps = (error) => ({
        kind: "error",
        className: "switch-error",
        lowContrast: false,
        role: "alert",
        title: error.message,
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
            <br />
            <Row>
                <Column>
                    <TextInput
                        id='text'
                        value={userId ? userId : ""}
                        onChange={(e) => emailInput(e)}
                    ></TextInput>
                </Column>
                <Column>
                    <Button {...goButtonProps()}>Go</Button>
                </Column>
            </Row>
            <br />

            <DataTable
                rows={rows}
                headers={headers}
                render={({
                    rows,
                    headers,
                    getHeaderProps,
                    getExpandHeaderProps,
                    getRowProps,
                    getTableProps,
                    getTableContainerProps,
                }) => (
                    <TableContainer
                        title='Subscriptions'
                        description=''
                        {...getTableContainerProps()}
                    >
                        <Table {...getTableProps()}>
                            <TableHead>
                                <TableRow>
                                    <TableExpandHeader
                                        enableExpando={true}
                                        {...getExpandHeaderProps()}
                                    />
                                    {headers.map((header, i) => (
                                        <TableHeader
                                            key={i}
                                            {...getHeaderProps({ header })}
                                        >
                                            {header.header}
                                        </TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <React.Fragment key={row.id}>
                                        <TableExpandRow
                                            {...getRowProps({ row })}
                                        >
                                            <TableCell>
                                                {row.cells[0].value}
                                            </TableCell>

                                            <TableCell key={uuid()}>
                                                <Row>
                                                    <Column
                                                        sm={12}
                                                        md={12}
                                                        lg={7}
                                                    >
                                                        {row.id.split("/")[1]}
                                                    </Column>
                                                    <Column
                                                        sm={12}
                                                        md={12}
                                                        lg={3}
                                                    >
                                                        <Button
                                                            {...switchButtonProps(
                                                                row.id
                                                            )}
                                                        >
                                                            Switch Plan
                                                        </Button>
                                                    </Column>
                                                    <Column
                                                        sm={12}
                                                        md={12}
                                                        lg={2}
                                                    >
                                                        <Button
                                                            {...updateButtonProps(
                                                                row.id.split(
                                                                    "/"
                                                                )[0]
                                                            )}
                                                        >
                                                            Update
                                                        </Button>
                                                    </Column>
                                                </Row>
                                            </TableCell>
                                        </TableExpandRow>
                                        <TableExpandedRow
                                            colSpan={headers.length + 1}
                                            className='demo-expanded-td'
                                        >
                                            <Row key={uuid()}>
                                                <Column>
                                                    <h6>Name</h6>
                                                </Column>
                                                <Column>
                                                    <h6>State</h6>
                                                </Column>
                                                <Column>
                                                    <h6>Quantity</h6>
                                                </Column>
                                            </Row>
                                            {subscriptions
                                                .filter(
                                                    (data) =>
                                                        data.order
                                                            .orderReferenceNumber ===
                                                        row.id.split("/")[1]
                                                )
                                                .map((plan) => (
                                                    <>
                                                        <Row
                                                            style={{
                                                                padding: "10px",
                                                            }}
                                                            key={uuid()}
                                                        >
                                                            <Column>
                                                                <h6>
                                                                    {plan.name}
                                                                </h6>
                                                            </Column>
                                                            <Column>
                                                                <div>
                                                                    {plan.state}
                                                                </div>
                                                            </Column>
                                                            <Column>
                                                                <div>
                                                                    {
                                                                        plan.quantity
                                                                    }
                                                                </div>
                                                            </Column>
                                                        </Row>
                                                    </>
                                                ))}
                                        </TableExpandedRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            />

            {spinner && <Loading {...loadingProps()} />}
        </ContainerComponent>
    );
}
