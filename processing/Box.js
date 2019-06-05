export default class Box {
    /**
     * Pass in the element's id and its desired column names
     * @param {string} id
     * @param {string[]} columnNames
     */
    constructor(id, columnNames) {
        this.element = document.getElementById(id);
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
