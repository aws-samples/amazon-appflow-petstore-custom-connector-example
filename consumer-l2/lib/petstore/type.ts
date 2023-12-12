/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { ConnectorType } from "@cdklabs/cdk-appflow";

/**
 * @internal
 */
export class PetStoreConnectorType extends ConnectorType {

    public static get instance(): ConnectorType {
        if (!PetStoreConnectorType.actualInstance) {
            PetStoreConnectorType.actualInstance = new PetStoreConnectorType();
        }
        return PetStoreConnectorType.actualInstance;
    }

    private static actualInstance: ConnectorType;

    constructor() {
        super('PetStore', true);
    }
}