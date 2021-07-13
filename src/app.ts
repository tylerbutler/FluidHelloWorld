/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ISharedMap, SharedMap } from "@fluid-experimental/fluid-framework";
import type { ContainerSchema } from '@fluid-experimental/fluid-static';
import { FrsClient, FrsConnectionConfig } from '@fluid-experimental/frs-client';
import TinyliciousClient from '@fluid-experimental/tinylicious-client';
import { getContainerId } from './utils';
import { vueRenderView as renderView } from './view';
const dotenv = require('dotenv');

// Load env variables from .env file
dotenv.config();

// Define the server we will be using and initialize Fluid
const service = process.env.FRS_SERVICE || "TINY";

const connectionConfig: FrsConnectionConfig = {
    type: "key",
    tenantId: process.env.FRS_TENANT!,
    key: process.env.FRS_KEY!,
    orderer: process.env.FRS_ORDERER!,
    storage: process.env.FRS_STORAGE!,
};

if (service === "FRS") {
    FrsClient.init(connectionConfig);
} else {
    TinyliciousClient.init();
}

const { id, isNew } = getContainerId();

async function start() {
    const serviceConfig = { id };

    const containerSchema: ContainerSchema = {
        name: 'hello-world-demo-container',
        initialObjects: { dice: SharedMap }
    };

    const client = service ? FrsClient : TinyliciousClient;
    const [fluidContainer] = isNew
        ? (await client.createContainer(serviceConfig, containerSchema))
        : (await client.getContainer(serviceConfig, containerSchema));


    renderView(
        fluidContainer.initialObjects.dice as ISharedMap,
        document.getElementById('content') as HTMLDivElement
    );
}

start().catch((error) => console.error(error));
