/*
#
# Copyright 2020- IBM Inc. All rights reserved
# SPDX-License-Identifier: Apache2.0
#
*/
import React from "react";
import { Row, Column, Button } from "carbon-components-react";

import "./Card.css";

export default function CardComponent(props) {
  const { title, description, rightButton } = props;

  return (
    <div className="card--container">
      <div className="card--body">
        <div className="body--title">
          <span>{title}</span>
        </div>
        <div className="body--details">
          <span>{description}</span>
        </div>

        <div className="body--footer">
          <Row className="card-footer--section">
            <Column
              sm={4}
              md={4}
              lg={4}
              xlg={4}
              className="left-section--text"
            ></Column>
            <Column
              sm={8}
              md={8}
              lg={8}
              xlg={8}
              className="right-section--text"
            >
              {rightButton ? (
                <Button {...rightButton}>{rightButton.title}</Button>
              ) : (
                ""
              )}
            </Column>
          </Row>
        </div>
      </div>
    </div>
  );
}
