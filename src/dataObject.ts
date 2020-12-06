import { EventEmitter } from "events";
import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { IValueChanged } from "@fluidframework/map";
import { SharedCounter } from "@fluidframework/counter";
import { IFluidHandle } from "@fluidframework/core-interfaces";

/**
 * IDiceRoller describes the public API surface for our dice roller data object.
 */
export interface ICounterPlus extends EventEmitter {
    readonly value: number;
    increment: (step?: number) => void;
    on(event: "incremented", listener: (incrementAmount: number, newValue: number) => void): this;

    readonly canBeNegative: boolean;
    readonly stepValue: number;
    on(event: "propertyChanged", listener: (property: string, previousValue: any) => void): this;
}

const counterKey = "counter";
const canBeNegativeKey = "_canBeNegative";
const stepValueKey = "_stepValue";

export class CounterPlus extends DataObject implements ICounterPlus {
    private internalCounter: SharedCounter | undefined;

    /**
     * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
     * initialize the state of the DataObject.
     */
    protected async initializingFirstTime() {
        this.internalCounter = SharedCounter.create(this.runtime);
        this.root.set(counterKey, this.internalCounter.handle);
        this.root.set(canBeNegativeKey, false);
        this.root.set(stepValueKey, 1);
    }

    /**
     * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
     * DataObject, by registering an event listener for dice rolls.
     */
    protected async hasInitialized() {
        // stash the sharedCounter for synchronous access
        this.internalCounter = await this.root.get<IFluidHandle<SharedCounter>>(counterKey).get();
        this.internalCounter.on("incremented", (incrementedAmount, newValue) => {
            console.log(`incrementing by ${incrementedAmount} ==> ${newValue}`);
            this.emit("incremented", incrementedAmount, newValue);
        });

        this.root.on("valueChanged", (changed: IValueChanged) => {
            console.log(`valueChanged: ${changed.key} (was ${changed.previousValue})`);
            if (changed.key.startsWith("_")) {
                this.emit("propertyChanged", changed.key.substring(1), changed.previousValue);
            }
        });
    }

    public get value() {
        if (this.internalCounter) {
            return this.internalCounter.value;
        }
        return 0;
    }

    public get stepValue() {
        return this.root.get<number>(stepValueKey);
    }

    public get canBeNegative() {
        return this.root.get<boolean>(canBeNegativeKey);
    }

    public increment = (step?: number) => {
        if (this.stepValue) {
            step = this.stepValue;
        } else {
            step = 1;
        }

        const newValue = this.value + step;
        if (!this.canBeNegative && newValue < 0) {
            this.internalCounter?.increment(this.value * -1);
        } else {
            this.internalCounter?.increment(newValue);
        }
    };
}

/**
 * The DataObjectFactory is used by Fluid Framework to instantiate our DataObject.  We provide it with a unique name
 * and the constructor it will call.  In this scenario, the third and fourth arguments are not used.
 */
export const CounterPlusInstantiationFactory = new DataObjectFactory(
    "counter-plus",
    CounterPlus,
    [SharedCounter.getFactory()],
    {},
);
