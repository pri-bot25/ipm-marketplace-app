/*
#
# Copyright 2020- IBM Inc. All rights reserved
# SPDX-License-Identifier: Apache2.0
#
*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loading, Grid, Row, Column } from "carbon-components-react";

import ContainerComponent from "./../Layout/Container/ContainerComponent";
import CardComponent from "./../Card/CardComponent";

export default function ProductsComponent(props) {
    const [products, setProducts] = useState([]);
    const [loading, setLoader] = useState(true);

    useEffect(() => {
        const hostname =
            process.env.NODE_ENV === "development"
                ? "http://localhost:3000"
                : window.location.origin;

        axios.get(`${hostname}/partner/products/data`).then((response) => {
            setLoader(false);
            if (response.data) {
                const products = response.data.products;
                const ibmConfiguratorProducts = products.filter((data) => {
                    for (let plan of data.purchasePlans) {
                        if (plan.hasOwnProperty("supportedByIbmConfigurator")) {
                            return data;
                        }
                    }
                });

                setProducts(ibmConfiguratorProducts);
            }
        });
    }, []);

    const redirectToPlans = (product) => {
        props.history.push({
            pathname: `/partner/product/${product.id}/plans`,
            state: product,
        });
    };

    const loaderProps = {
        active: true,
        withOverlay: true,
        small: false,
        description: "Loader",
        className: "loader",
    };

    const rightButtonProps = (product) => {
        return {
            title: "Show Plans",
            size: "small",
            onClick: () => redirectToPlans(product),
        };
    };

    const cardProps = (product) => {
        return {
            title: product.name,
            description: product.longDescription,
            rightButton: rightButtonProps(product),
        };
    };

    return (
        <ContainerComponent>
            {loading ? (
                <Loading {...loaderProps} />
            ) : (
                <Grid style={{ marginTop: "2rem" }}>
                    <Row>
                        <Column style={{ margin: "0 20px" }}>
                            <h3>IBM Product Catalog</h3>
                        </Column>
                    </Row>
                    <Row>
                        <Column style={{ margin: "0 20px" }}>
                            <p>
                                Click Show Plan to view plan for desired product
                            </p>
                        </Column>
                    </Row>
                    <Row>
                        {products.map((product) => (
                            <Column
                                key={product.id}
                                sm={12}
                                md={4}
                                lg={4}
                                xlg={3}
                            >
                                <CardComponent {...cardProps(product)} />
                            </Column>
                        ))}
                    </Row>
                </Grid>
            )}
        </ContainerComponent>
    );
}
