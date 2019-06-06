class Box {
    /**
     * Pass in the element's id and its desired column names
     * @param {string} id
     * @param {string[]} columnNames
     */
    constructor(id) {
        this.element = document.getElementById(id);
    }
}

export class TableBox extends Box {
    constructor(id, columnNames) {
        super(id);
        const columns = this.element.querySelectorAll('.table__col');
        columnNames.forEach((columnName, index) => {
            this[columnName] = columns[index];
        });
    }

    addResult(parentElement, amount, additionalClassList = null) {
        const div = document.createElement('div');
        div.innerText = amount;
        div.classList.add('table__result');
        if (additionalClassList) {
            div.classList.add(additionalClassList);
        }
        parentElement.appendChild(div);
    }
}

export class GraphBox extends Box {
    constructor(id, chartData) {
        super(id);
        const heights = new Map(Array.from(chartData).sort());
        this.max = heights.values().next().value;
        heights.forEach((height, sectionId) => this.createColumn(height, sectionId));
    }

    createColumn(height, sectionId) {
        const div = document.createElement('div');
        div.classList.add('chart__column');
        div.classList.add('shadow-sm');
        div.classList.add(`stand__section__color--${sectionId}`);
        const barHeight = 120 * (height / this.max);
        div.setAttribute('data-value', height);
        div.style.height = `${barHeight}px`;
        div.style.top = `${120 - barHeight}px`;
        this.element.appendChild(div);
    }
}
