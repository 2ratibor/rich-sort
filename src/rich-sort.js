/**
 * Method for sorting the array of numbers
 *
 * @param comparisonFunc callback function which set the order of sorting. Logic the same like in native array's method ".sort()". Parameter is optional
 * @returns {Array} return the sorted array of numbers. Implements the pattern of chain responsibility
 */
Array.prototype.richSort = function(comparisonFunc) {
    if (this.length < 2) {
        return this;
    }

    let compareFunc = comparisonFunc;
    if (compareFunc === undefined) {
        compareFunc = comparisonFuncDefault;
    }

    let minIndex = 0;
    let maxIndex = 1;
    let arr = this.slice();
    const arrLength = arr.length;

    for (let i = 0; i < arrLength; i++) {
        if (compareFunc(arr[minIndex], arr[i]) > 0) {
            minIndex = i;
        }
        if (compareFunc(arr[i], arr[maxIndex]) > 0) {
            maxIndex = i;
        }
    }

    const resultArr = [arr[minIndex], arr[maxIndex]];

    arr = arr.filter((item, index) => {
        return index !== minIndex && index !== maxIndex;
    });
    const filteredArrLength = arr.length;

    for (let j = 0; j < filteredArrLength; j++) {
        const posNumber = getTargetPositionNumber(compareFunc, resultArr, arr[j]);
        resultArr.splice(posNumber, 0, arr[j]);
    }

    const resultArrLength = resultArr.length;
    for (let k = 0; k < resultArrLength; k++) {
        this[k] = resultArr[k];
    }

    function comparisonFuncDefault(a, b) {
        return a - b;
    }

    function getTargetPositionNumber(compFunc, arr, num) {
        const positionNumber = Math.floor(arr.length / 2);
        const targetPositionIsToTheLeft = compFunc(arr[positionNumber - 1], num) > 0;
        const targetPositionIsToTheRight = compFunc(num, arr[positionNumber]) > 0;
        if (!targetPositionIsToTheLeft && !targetPositionIsToTheRight) {
            return positionNumber;
        } else if (targetPositionIsToTheLeft) {
            return getTargetPositionNumber(compFunc, arr.slice(0, positionNumber), num);
        } else {
            return positionNumber + getTargetPositionNumber(compFunc, arr.slice(positionNumber), num);
        }
    }

    return this;
}

