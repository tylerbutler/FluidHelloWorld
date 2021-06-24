/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ISharedMap, SharedMap } from "@fluid-experimental/fluid-framework";
import { FrsConnectionConfig, FrsClient } from '@fluid-experimental/frs-client';
import type { ContainerSchema } from '@fluid-experimental/fluid-static';
import TinyliciousClient from '@fluid-experimental/tinylicious-client';
import { getContainerId } from './utils';
import { vueRenderView as renderView } from './view';

// Define the server we will be using and initialize Fluid
const useFrs = true;

const connectionConfig: FrsConnectionConfig = {
  type: "key",
  tenantId: "",
  key: "",
  orderer: "",
  storage: "",
};
if (useFrs) {
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

    const client = useFrs ? FrsClient : TinyliciousClient;
    const [fluidContainer] = isNew
        ? (await client.createContainer({ id }, containerSchema))
        : (await client.getContainer({ id }, containerSchema));


    renderView(
        fluidContainer.initialObjects.dice as ISharedMap, 
        document.getElementById('content') as HTMLDivElement
    );
}

start().catch((error) => console.error(error));
