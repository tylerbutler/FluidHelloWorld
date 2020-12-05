import { h, render } from "preact";
import htm from "htm";
import { ICounterPlus } from "./dataObject";

// Initialize htm with Preact
const html = htm.bind(h);

/**
 * Render an IDiceRoller into a given div as a text character, with a button to roll it.
 * @param counter - The Data Object to be rendered
 * @param div - The div to render into
 */
export function renderCounter(counter: ICounterPlus, div: HTMLDivElement) {
    // const wrapperDiv = document.createElement("div");
    // wrapperDiv.style.textAlign = "center";
    // div.append(wrapperDiv);

    // const diceCharDiv = document.createElement("div");
    // diceCharDiv.style.fontSize = "200px";

    // const rollButton = document.createElement("button");
    // rollButton.style.fontSize = "50px";
    // rollButton.textContent = "Roll";
    // // Call the roll method to modify the shared data when the button is clicked.
    // rollButton.addEventListener("click", counter.roll);

    // wrapperDiv.append(diceCharDiv, rollButton);

    // Get the current value of the shared data to update the view whenever it changes.
    const updateCounterDisplay = () => {
        render(html`<${Component} counter=${counter}/>`, document.body);
    };
    updateCounterDisplay();

    // Use the diceRolled event to trigger the rerender whenever the value changes.
    counter.on("incremented", updateCounterDisplay);
    counter.on("propertyChanged", updateCounterDisplay);
}

function Component(counter: ICounterPlus) {
    return html`
    <div>
        <span><button style="fontSize: 50px;" onClick=${counter.increment()}>UP</button></span>
        <span>
            <div style="fontSize: 50px;">${counter.value}</div>
            <div style="fontSize: 20px;">Step: ${counter.stepValue}</div>
        </span>
        <span><button style="fontSize: 50px;" onClick=${counter.increment(counter.stepValue * -1)}>DOWN</button></span>
    </div>
    `;
}

