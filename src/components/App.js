/*
#
# Copyright 2020- IBM Inc. All rights reserved
# SPDX-License-Identifier: Apache2.0
#
*/
import React from "react";
import "./App.css";

import { Loading } from "carbon-components-react";

import {
    Route,
    Switch,
    Redirect,
    BrowserRouter as Router,
} from "react-router-dom";

const Products = React.lazy(() => import("./Products/ProductsComponent"));
const Plans = React.lazy(() => import("./Plans/PlansComponent"));
const Quote = React.lazy(() => import("./Quote/QuoteComponent"));
const SwitchComponent = React.lazy(() =>
    import("./SwitchComponent/SwitchComponent")
);
const Header = React.lazy(() => import("./Layout/Header/HeaderComponent"));
const Subscriptions = React.lazy(() =>
    import("./Subscriptions/SubscriptionsComponent")
);

function App() {
    const [subscriptions, setSubscriptions] = React.useState([]);
    const [rows, setRows] = React.useState([]);
    const [timestamp, setTimestamp] = React.useState(0);

    const loaderProps = {
        active: true,
        withOverlay: true,
        small: false,
        description: "Loader",
        className: "suspense-loader",
    };

    return (
        <React.Suspense fallback={<Loading {...loaderProps} />}>
            <Router>
                <Header />
                <Switch>
                    <Route
                        exact
                        path='/partner/products'
                        render={(routeProps) => <Products {...routeProps} />}
                    />
                    <Route
                        exact
                        path='/partner/product/:productID/plans'
                        render={(routeProps) => <Plans {...routeProps} />}
                    />
                    <Route
                        exact
                        path='/partner/quote'
                        render={(routeProps) => <Quote {...routeProps} />}
                    />
                    <Route
                        exact
                        path='/partner/subscriptions'
                        render={(routeProps) => (
                            <Subscriptions
                                setSubscriptions={setSubscriptions}
                                subscriptions={subscriptions}
                                setRows={setRows}
                                rows={rows}
                                setTimestamp={setTimestamp}
                                timestamp={timestamp}
                                {...routeProps}
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/partner/:uuid/:planId/:orderReferenceNumber/switch'
                        render={(routeProps) => (
                            <SwitchComponent {...routeProps} />
                        )}
                    />

                    <Route render={() => <Redirect to='partner/products' />} />
                </Switch>
            </Router>
        </React.Suspense>
    );
}

export default App;
