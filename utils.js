module.exports = {
    getDupes: (array) => {
        const checkedSet = new Set();
        const dupesSet = new Set();

        array.forEach(item => {
            if (checkedSet.has(item)) {
                dupesSet.add(item);
            } else {
                checkedSet.add(item);
            }
        });

        return [...dupesSet];
    }
}