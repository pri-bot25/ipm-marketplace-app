/*
#
# Copyright 2020- IBM Inc. All rights reserved
# SPDX-License-Identifier: Apache2.0
#
*/
import React from "react";
import { withRouter } from "react-router";
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderContainer,
  SkipToContent,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from "carbon-components-react";
import {
  Search20,
  NotificationFilled20,
  AppSwitcher20,
  UserAvatarFilled20,
} from "@carbon/icons-react";

import "./Header.scss";
import { APP_NAME } from "./../../../static";

function HeaderComponent({ history, location }) {
  const handleRedirect = (path) => history.push(path);

  //this will be deleted, no further need
  const highlightNavTab = (title) => location.pathname.includes(title);

  const renderNavTabs = () => {
    return (
      <>
        <HeaderMenuItem
          className={`navtab-element ${
            highlightNavTab(`/partner/products`) ? `navtab--active` : ""
          }`}
          onClick={() => handleRedirect(`/partner/products`)}
        >
          {"Product Catalog"}
        </HeaderMenuItem>

        <HeaderMenuItem
          className={`navtab-element ${
            highlightNavTab(`/partner/subscriptions`) ? `navtab--active` : ""
          }`}
          onClick={() => handleRedirect(`/partner/subscriptions`)}
        >
          {"Subscriptions"}
        </HeaderMenuItem>
      </>
    );
  };

  return (
    <React.Fragment>
      <HeaderContainer
        render={() => (
          <>
            <Header aria-label="IBM">
              <SkipToContent />
              <HeaderName
                prefix=""
                onClick={() => handleRedirect("/partner/products")}
              >
                <span className="application-title"> {APP_NAME} </span>
              </HeaderName>
              <HeaderNavigation aria-label="Menu">
                {renderNavTabs()}
              </HeaderNavigation>
              <React.Fragment>
                <HeaderGlobalBar>
                  <HeaderGlobalAction
                    aria-label="Search"
                    className="header-search-button"
                    onClick={() => {}}
                  >
                    <Search20 />
                  </HeaderGlobalAction>
                  <HeaderGlobalAction
                    aria-label="Notifications"
                    className="header-notification-button"
                    onClick={() => {}}
                  >
                    <NotificationFilled20 />
                  </HeaderGlobalAction>
                  <HeaderGlobalAction
                    aria-label="App Switcher"
                    className="header-actions-button"
                    isActive
                    onClick={() => {}}
                  >
                    <AppSwitcher20 />
                  </HeaderGlobalAction>
                  <HeaderGlobalAction
                    aria-label="App Switcher"
                    className="header-user-button"
                    isActive
                    onClick={() => {}}
                  >
                    <UserAvatarFilled20 />
                  </HeaderGlobalAction>
                </HeaderGlobalBar>
              </React.Fragment>
            </Header>
          </>
        )}
      />
    </React.Fragment>
  );
}

export default withRouter((props) => <HeaderComponent {...props} />);
