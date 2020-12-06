import { render } from "preact";
import { html } from 'htm/preact';
import { ICounterPlus } from "./dataObject";

// Initialize htm with Preact
// const html = htm.bind(h);

/**
 * Render an IDiceRoller into a given div as a text character, with a button to roll it.
 * @param counter - The Data Object to be rendered
 * @param div - The div to render into
 */
export function renderCounter(counter: ICounterPlus, div: HTMLDivElement) {
    const updateCounterDisplay = () => {
        render(html`<${CounterView} props=${{ counter }}/>`, div);
    };
    updateCounterDisplay();

    // Use the diceRolled event to trigger the rerender whenever the value changes.
    counter.on("incremented", updateCounterDisplay);
    counter.on("propertyChanged", updateCounterDisplay);

    function CounterView(props: any) {
        console.log(JSON.stringify(props.counter.stepValue));
        return html`
        <div>
            <span><button style="fontSize: 50px;" onClick=${() => { console.log(counter); counter.increment() }}> UP </button></span >
            <span>
                <div style="fontSize: 50px;">${counter.value}</div>
                <div style="fontSize: 20px;">Step: ${counter.stepValue}</div>
            </span>
            <span><button style="fontSize: 50px;" onClick=${() => counter.increment(counter.stepValue * -1)}>DOWN</button></span>
        </div>
        `;
    }
}


