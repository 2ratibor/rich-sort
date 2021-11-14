const someArr = new Array(10000).fill(0).map(() => (false) ? Math.floor(Math.random() * 20) : Math.random());


function runDefaultSort(passedArr) {
    const start = new Date();
    let arr = passedArr.slice();
    arr.sort((a, b) => {
        return a - b;
    });
    console.log(`Benchmark for "defaultSort": ${new Date() - start}`);
    return arr;
}


// RichSort (my own algorithm of sorting) ===================================================
// O(N * log N)
function richSort(passedArr) {
    const start = new Date();
    let arr = passedArr.slice();

    if (arr.length < 2) {
        return arr;
    }

    let minIndex = 0;
    let maxIndex = 0;

    // O(N - 1)
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[minIndex]) {
            minIndex = i;
        }
        if (arr[i] > arr[maxIndex]) {
            maxIndex = i;
        }
    }

    const resultArr = [arr[minIndex], arr[maxIndex]];

    // O(N)
    arr = arr.filter((item, index) => {
        return index !== minIndex && index !== maxIndex;
    });

    // O(N * log N)
    for (let j = 0; j < arr.length; j++) {
        const posNumber = getTargetPositionNumber(resultArr, arr[j]);
        resultArr.splice(posNumber, 0, arr[j]);
    }

    console.log(`Benchmark for "richSort": ${new Date() - start}`);
    return resultArr;
    // O(N - 1 + N + N * log N) = O(N(1 + 1 + logN)) = O(N * log N)
}

// O(log N)
function getTargetPositionNumber(arr, num) {
    const positionNumber = Math.floor(arr.length / 2);
    const targetPositionIsToTheLeft = num < arr[positionNumber - 1];
    const targetPositionIsToTheRight = num > arr[positionNumber];
    if (!targetPositionIsToTheLeft && !targetPositionIsToTheRight) {
        return positionNumber;
    } else if (targetPositionIsToTheLeft) {
        return getTargetPositionNumber(arr.slice(0, positionNumber), num);
    } else {
        return positionNumber + getTargetPositionNumber(arr.slice(positionNumber), num);
    }
}


// LibrarianBasedSort (some experimental algorithm) =====================================================
function librarianBasedSort(passedArr, scaleCoefficient) {
    const start = new Date();
    let arr = passedArr.slice();

    if (arr.length < 2) {
        return arr;
    }

    let minIndex = 0;
    let maxIndex = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[minIndex]) {
            minIndex = i;
        }
        if (arr[i] > arr[maxIndex]) {
            maxIndex = i;
        }
    }

    let resultArr = [
        arr[minIndex],
        ...new Array((arr.length - 2) * Math.ceil(scaleCoefficient)).fill(null),
        arr[maxIndex]
    ];

    arr = arr.filter((item, index) => {
        return index !== minIndex && index !== maxIndex;
    });

    for (let j = 0; j < arr.length; j++) {
        const indexOfElementForFilling = getIndexOfElementForFilling(resultArr, arr[j]);
        resultArr[indexOfElementForFilling] = arr[j];
    }

    resultArr = resultArr.filter((item) => item !== null);

    console.log(`Benchmark for "librarianBasedSort": ${new Date() - start}`);
    return resultArr;
}

function getIndexOfElementForFilling(arr, num) {
    const middlePointPositionIndex = Math.floor(arr.length / 2);
    let indexOfFirstFilledElementToTheLeft = middlePointPositionIndex - 1;
    while (indexOfFirstFilledElementToTheLeft > 0 && arr[indexOfFirstFilledElementToTheLeft] === null) {
        indexOfFirstFilledElementToTheLeft = indexOfFirstFilledElementToTheLeft - 1;
    }
    let indexOfFirstFilledElementToTheRight = middlePointPositionIndex;
    while ((indexOfFirstFilledElementToTheRight < (arr.length - 1)) && arr[indexOfFirstFilledElementToTheRight] === null) {
        indexOfFirstFilledElementToTheRight = indexOfFirstFilledElementToTheRight + 1;
    }
    const targetPositionIsToTheLeft = num < arr[indexOfFirstFilledElementToTheLeft];
    const targetPositionIsToTheRight = num > arr[indexOfFirstFilledElementToTheRight];
    if (!targetPositionIsToTheLeft && !targetPositionIsToTheRight) {
        return Math.floor((indexOfFirstFilledElementToTheLeft + indexOfFirstFilledElementToTheRight) / 2);
    } else if (targetPositionIsToTheLeft) {
        return getIndexOfElementForFilling(arr.slice(0, indexOfFirstFilledElementToTheLeft + 1), num);
    } else {
        return indexOfFirstFilledElementToTheRight + getIndexOfElementForFilling(arr.slice(indexOfFirstFilledElementToTheRight), num);
    }
}


// QuickSort ===================================================
function runQuickSort(array) {
    const start = new Date();
    const arr = array.slice();
    const resultArr = quickSort(arr);
    console.log(`Benchmark for "quickSort": ${new Date() - start}`);
    return resultArr;
}

function quickSort(arr) {
    if (arr.length < 2) {
        return arr
    }

    const pivot = arr[0];
    const less = [];
    const greater = [];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < pivot) {
            less.push(arr[i]);
        } else {
            greater.push(arr[i]);
        }
    }
    return [...quickSort(less), pivot, ...quickSort(greater)];
}


// MergeSort ===================================================
function runMergeSort(array) {
    const start = new Date();
    const arrCopy = array.slice();
    const resultArr = mergeSort(arrCopy);
    console.log(`Benchmark for "mergeSort": ${new Date() - start}`);
    return resultArr;
}

function mergeSort(arr) {
    // Проверяем корректность переданных данных
    if (!arr || !arr.length) {
        return null;
    }
    //Если массив содержит один элемент просто возвращаем его
    if (arr.length <= 1) {
        return arr;
    }
    // Находим середину массива и делим его на два
    const middle = Math.floor(arr.length / 2);
    const arrLeft = arr.slice(0, middle);
    const arrRight = arr.slice(middle);
    // Для новых массивов снова вызываем сортировку,
    // сливаем их и возвращаем снова единый массив
    return merge(mergeSort(arrLeft), mergeSort(arrRight));
}

function merge(arrFirst, arrSecond) {
    const arrSort = [];
    let i = j = 0;
    // сравниваем два массива, поочередно сдвигая указатели
    while (i < arrFirst.length && j < arrSecond.length) {
        arrSort.push(
            (arrFirst[i] < arrSecond[j]) ?
                arrFirst[i++] : arrSecond[j++]
        );
    }
    // обрабатываем последний элемент при разной длине массивов
    // и возвращаем один отсортированный массив
    return [
        ...arrSort,
        ...arrFirst.slice(i),
        ...arrSecond.slice(j)
    ];
}


// HeapSort ===================================================
var array_length;
function heapSort(passedArr) {
    const start = new Date();
    const input = passedArr.slice();

    array_length = input.length;

    for (var i = Math.floor(array_length / 2); i >= 0; i -= 1)      {
        heap_root(input, i);
    }

    for (i = input.length - 1; i > 0; i--) {
        swap(input, 0, i);
        array_length--;
        heap_root(input, 0);
    }

    console.log(`Benchmark for "heapSort": ${new Date() - start}`);
    return input;
}

function heap_root(input, i) {
    var left = 2 * i + 1;
    var right = 2 * i + 2;
    var max = i;

    if (left < array_length && input[left] > input[max]) {
        max = left;
    }

    if (right < array_length && input[right] > input[max])     {
        max = right;
    }

    if (max != i) {
        swap(input, i, max);
        heap_root(input, max);
    }
}

function swap(input, index_A, index_B) {
    var temp = input[index_A];

    input[index_A] = input[index_B];
    input[index_B] = temp;
}


// BubbleSort ===================================================
function bubbleSort(passedArr) {
    const start = new Date();
    const arr = passedArr.slice();

    for (let i = 0; i < arr.length - 1; i++) {
        let countOfSwapping = 0;
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                const tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
                countOfSwapping = countOfSwapping + 1;
            }
        }
        if (!countOfSwapping) break;
    }

    console.log(`Benchmark for "bubbleSort": ${new Date() - start}`);
    return arr;
}


// InsertionSort ===================================================
function insertionSort(passedArr) {
    const start = new Date();
    const inputArr = passedArr.slice();

    let n = inputArr.length;
    for (let i = 1; i < n; i++) {
        // Choosing the first element in our unsorted subarray
        let current = inputArr[i];
        // The last element of our sorted subarray
        let j = i - 1;
        while ((j > -1) && (current < inputArr[j])) {
            inputArr[j + 1] = inputArr[j];
            j--;
        }
        inputArr[j + 1] = current;
    }

    console.log(`Benchmark for "insertionSort": ${new Date() - start}`);
    return inputArr;
}


// SelectionSort ===================================================
function selectionSort(passedArr) {
    const start = new Date();
    const arr = passedArr.slice();

    for (let i = 0; i < arr.length - 1; i++) {
        let minimalIndex = i;

        for (let j = 1 + i; j < arr.length; j++) {
            if (arr[j] < arr[minimalIndex]) {
                minimalIndex = j;
            }
        }

        if (minimalIndex !== i) {
            const tmp = arr[i];
            arr[i] = arr[minimalIndex];
            arr[minimalIndex] = tmp;
        }
    }

    console.log(`Benchmark for "selectionSort": ${new Date() - start}`);
    return arr;
}













// TimSort ==================================
function runTimSort(passedArr) {
    const start = new Date();
    let arr = passedArr.slice();
    arr.timsort((a, b) => {
        return a - b;
    });
    console.log(`Benchmark for "timSort": ${new Date() - start}`);
    return arr;
}

Array.prototype.timsort = function(comp){

    var global_a=this
    var MIN_MERGE = 32;
    var MIN_GALLOP = 7
    var runBase=[];
    var runLen=[];
    var stackSize = 0;
    var compare = comp;

    sort(this,0,this.length,compare);

    /*
         * The next two methods (which are package private and static) constitute the entire API of this class. Each of these methods
         * obeys the contract of the public method with the same signature in java.util.Arrays.
         */

    function sort (a, lo, hi, compare) {

        if (typeof compare != "function") {
            throw new Error("Compare is not a function.");
            return;
        }

        stackSize = 0;
        runBase=[];
        runLen=[];

        rangeCheck(a.length, lo, hi);
        var nRemaining = hi - lo;
        if (nRemaining < 2) return; // Arrays of size 0 and 1 are always sorted

        // If array is small, do a "mini-TimSort" with no merges
        if (nRemaining < MIN_MERGE) {
            var initRunLen = countRunAndMakeAscending(a, lo, hi, compare);
            binarySort(a, lo, hi, lo + initRunLen, compare);
            return;
        }

        /**
         * March over the array once, left to right, finding natural runs, extending short natural runs to minRun elements, and
         * merging runs to maintain stack invariant.
         */
        var ts = [];
        var minRun = minRunLength(nRemaining);
        do {
            // Identify next run
            var runLenVar = countRunAndMakeAscending(a, lo, hi, compare);

            // If run is short, extend to min(minRun, nRemaining)
            if (runLenVar < minRun) {
                var force = nRemaining <= minRun ? nRemaining : minRun;
                binarySort(a, lo, lo + force, lo + runLenVar, compare);
                runLenVar = force;
            }

            // Push run onto pending-run stack, and maybe merge
            pushRun(lo, runLenVar);
            mergeCollapse();

            // Advance to find next run
            lo += runLenVar;
            nRemaining -= runLenVar;
        } while (nRemaining != 0);

        // Merge all remaining runs to complete sort
        mergeForceCollapse();
    }


    /**
     * Sorts the specified portion of the specified array using a binary insertion sort. This is the best method for sorting small
     * numbers of elements. It requires O(n log n) compares, but O(n^2) data movement (worst case).
     *
     * If the initial part of the specified range is already sorted, this method can take advantage of it: the method assumes that
     * the elements from index {@code lo}, inclusive, to {@code start}, exclusive are already sorted.
     *
     * @param a the array in which a range is to be sorted
     * @param lo the index of the first element in the range to be sorted
     * @param hi the index after the last element in the range to be sorted
     * @param start the index of the first element in the range that is not already known to be sorted (@code lo <= start <= hi}
     * @param c comparator to used for the sort
     */
    function binarySort (a, lo, hi, start, compare) {
        if (start == lo) start++;
        for (; start < hi; start++) {
            var pivot = a[start];

            // Set left (and right) to the index where a[start] (pivot) belongs
            var left = lo;
            var right = start;
            /*
            * Invariants: pivot >= all in [lo, left). pivot < all in [right, start).
            */
            while (left < right) {
                var mid = (left + right) >>> 1;
                if (compare(pivot, a[mid]) < 0)
                    right = mid;
                else
                    left = mid + 1;
            }
            /*
            * The invariants still hold: pivot >= all in [lo, left) and pivot < all in [left, start), so pivot belongs at left. Note
            * that if there are elements equal to pivot, left points to the first slot after them -- that's why this sort is stable.
            * Slide elements over to make room to make room for pivot.
            */
            var n = start - left; // The number of elements to move
            // Switch is just an optimization for arraycopy in default case
            switch (n) {
                case 2:
                    a[left + 2] = a[left + 1];
                case 1:
                    a[left + 1] = a[left];
                    break;
                default:
                    arraycopy(a, left, a, left + 1, n);
            }
            a[left] = pivot;
        }
    }


    /**
     * Returns the length of the run beginning at the specified position in the specified array and reverses the run if it is
     * descending (ensuring that the run will always be ascending when the method returns).
     *
     * A run is the longest ascending sequence with:
     *
     * a[lo] <= a[lo + 1] <= a[lo + 2] <= ...
     *
     * or the longest descending sequence with:
     *
     * a[lo] > a[lo + 1] > a[lo + 2] > ...
     *
     * For its intended use in a stable mergesort, the strictness of the definition of "descending" is needed so that the call can
     * safely reverse a descending sequence without violating stability.
     *
     * @param a the array in which a run is to be counted and possibly reversed
     * @param lo index of the first element in the run
     * @param hi index after the last element that may be contained in the run. It is required that @code{lo < hi}.
     * @param c the comparator to used for the sort
     * @return the length of the run beginning at the specified position in the specified array
     */
    function countRunAndMakeAscending (a, lo, hi, compare) {
        var runHi = lo + 1;

        // Find end of run, and reverse range if descending
        if (compare(a[runHi++], a[lo]) < 0) { // Descending
            while (runHi < hi && compare(a[runHi], a[runHi - 1]) < 0){
                runHi++;
            }
            reverseRange(a, lo, runHi);
        } else { // Ascending
            while (runHi < hi && compare(a[runHi], a[runHi - 1]) >= 0){
                runHi++;
            }
        }

        return runHi - lo;
    }

    /**
     * Reverse the specified range of the specified array.
     *
     * @param a the array in which a range is to be reversed
     * @param lo the index of the first element in the range to be reversed
     * @param hi the index after the last element in the range to be reversed
     */
    function /*private static void*/ reverseRange (/*Object[]*/ a, /*int*/ lo, /*int*/ hi) {
        hi--;
        while (lo < hi) {
            var t = a[lo];
            a[lo++] = a[hi];
            a[hi--] = t;
        }
    }


    /**
     * Returns the minimum acceptable run length for an array of the specified length. Natural runs shorter than this will be
     * extended with {@link #binarySort}.
     *
     * Roughly speaking, the computation is:
     *
     * If n < MIN_MERGE, return n (it's too small to bother with fancy stuff). Else if n is an exact power of 2, return
     * MIN_MERGE/2. Else return an int k, MIN_MERGE/2 <= k <= MIN_MERGE, such that n/k is close to, but strictly less than, an
     * exact power of 2.
     *
     * For the rationale, see listsort.txt.
     *
     * @param n the length of the array to be sorted
     * @return the length of the minimum run to be merged
     */
    function /*private static int*/ minRunLength (/*int*/ n) {
        //var v=0;
        var r = 0; // Becomes 1 if any 1 bits are shifted off
        /*while (n >= MIN_MERGE) { v++;
            r |= (n & 1);
            n >>= 1;
        }*/
        //console.log("minRunLength("+n+") "+v+" vueltas, result="+(n+r));
        //return n + r;
        return n + 1;
    }

    /**
     * Pushes the specified run onto the pending-run stack.
     *
     * @param runBase index of the first element in the run
     * @param runLen the number of elements in the run
     */
    function pushRun (runBaseArg, runLenArg) {
        //console.log("pushRun("+runBaseArg+","+runLenArg+")");
        //this.runBase[stackSize] = runBase;
        //runBase.push(runBaseArg);
        runBase[stackSize] = runBaseArg;

        //this.runLen[stackSize] = runLen;
        //runLen.push(runLenArg);
        runLen[stackSize] = runLenArg;
        stackSize++;
    }

    /**
     * Examines the stack of runs waiting to be merged and merges adjacent runs until the stack invariants are reestablished:
     *
     * 1. runLen[i - 3] > runLen[i - 2] + runLen[i - 1] 2. runLen[i - 2] > runLen[i - 1]
     *
     * This method is called each time a new run is pushed onto the stack, so the invariants are guaranteed to hold for i <
     * stackSize upon entry to the method.
     */
    function mergeCollapse () {
        while (stackSize > 1) {
            var n = stackSize - 2;
            if (n > 0 && runLen[n - 1] <= runLen[n] + runLen[n + 1]) {
                if (runLen[n - 1] < runLen[n + 1]) n--;
                mergeAt(n);
            } else if (runLen[n] <= runLen[n + 1]) {
                mergeAt(n);
            } else {
                break; // Invariant is established
            }
        }
    }

    /**
     * Merges all runs on the stack until only one remains. This method is called once, to complete the sort.
     */
    function mergeForceCollapse () {
        while (stackSize > 1) {
            var n = stackSize - 2;
            if (n > 0 && runLen[n - 1] < runLen[n + 1]) n--;
            mergeAt(n);
        }
    }


    /**
     * Merges the two runs at stack indices i and i+1. Run i must be the penultimate or antepenultimate run on the stack. In other
     * words, i must be equal to stackSize-2 or stackSize-3.
     *
     * @param i stack index of the first of the two runs to merge
     */
    function mergeAt (i) {

        var base1 = runBase[i];
        var len1 = runLen[i];
        var base2 = runBase[i + 1];
        var len2 = runLen[i + 1];

        /*
        * Record the length of the combined runs; if i is the 3rd-last run now, also slide over the last run (which isn't involved
        * in this merge). The current run (i+1) goes away in any case.
        */
        //var stackSize = runLen.length;
        runLen[i] = len1 + len2;
        if (i == stackSize  - 3) {
            runBase[i + 1] = runBase[i + 2];
            runLen[i + 1] = runLen[i + 2];
        }
        stackSize--;

        /*
        * Find where the first element of run2 goes in run1. Prior elements in run1 can be ignored (because they're already in
        * place).
        */

        var k = gallopRight(global_a[base2], global_a, base1, len1, 0, compare);
        base1 += k;
        len1 -= k;
        if (len1 == 0) return;

        /*
        * Find where the last element of run1 goes in run2. Subsequent elements in run2 can be ignored (because they're already in
        * place).
        */
        len2 = gallopLeft(global_a[base1 + len1 - 1], global_a, base2, len2, len2 - 1, compare);

        if (len2 == 0) return;

        // Merge remaining runs, using tmp array with min(len1, len2) elements
        if (len1 <= len2)
            mergeLo(base1, len1, base2, len2);
        else
            mergeHi(base1, len1, base2, len2);
    }


    /**
     * Locates the position at which to insert the specified key into the specified sorted range; if the range contains an element
     * equal to key, returns the index of the leftmost equal element.
     *
     * @param key the key whose insertion point to search for
     * @param a the array in which to search
     * @param base the index of the first element in the range
     * @param len the length of the range; must be > 0
     * @param hint the index at which to begin the search, 0 <= hint < n. The closer hint is to the result, the faster this method
     *           will run.
     * @param c the comparator used to order the range, and to search
     * @return the int k, 0 <= k <= n such that a[b + k - 1] < key <= a[b + k], pretending that a[b - 1] is minus infinity and a[b
     *         + n] is infinity. In other words, key belongs at index b + k; or in other words, the first k elements of a should
     *         precede key, and the last n - k should follow it.
     */
    function gallopLeft (key, a, base, len, hint, compare) {
        var lastOfs = 0;
        var ofs = 1;
        if (compare(key, a[base + hint]) > 0) {
            // Gallop right until a[base+hint+lastOfs] < key <= a[base+hint+ofs]
            var maxOfs = len - hint;
            while (ofs < maxOfs && compare(key, a[base + hint + ofs]) > 0) {
                lastOfs = ofs;
                ofs = (ofs << 1) + 1;
                if (ofs <= 0) // int overflow
                    ofs = maxOfs;
            }
            if (ofs > maxOfs) ofs = maxOfs;

            // Make offsets relative to base
            lastOfs += hint;
            ofs += hint;
        } else { // key <= a[base + hint]
            // Gallop left until a[base+hint-ofs] < key <= a[base+hint-lastOfs]
            var maxOfs = hint + 1;
            while (ofs < maxOfs && compare(key, a[base + hint - ofs]) <= 0) {
                lastOfs = ofs;
                ofs = (ofs << 1) + 1;
                if (ofs <= 0) // int overflow
                    ofs = maxOfs;
            }
            if (ofs > maxOfs) ofs = maxOfs;

            // Make offsets relative to base
            var tmp = lastOfs;
            lastOfs = hint - ofs;
            ofs = hint - tmp;
        }

        /*
        * Now a[base+lastOfs] < key <= a[base+ofs], so key belongs somewhere to the right of lastOfs but no farther right than ofs.
        * Do a binary search, with invariant a[base + lastOfs - 1] < key <= a[base + ofs].
        */
        lastOfs++;
        while (lastOfs < ofs) {
            var m = lastOfs + ((ofs - lastOfs) >>> 1);

            if (compare(key, a[base + m]) > 0)
                lastOfs = m + 1; // a[base + m] < key
            else
                ofs = m; // key <= a[base + m]
        }
        return ofs;
    }

    /**
     * Like gallopLeft, except that if the range contains an element equal to key, gallopRight returns the index after the
     * rightmost equal element.
     *
     * @param key the key whose insertion point to search for
     * @param a the array [] in which to search
     * @param base the index of the first element in the range
     * @param len the length of the range; must be > 0
     * @param hint the index at which to begin the search, 0 <= hint < n. The closer hint is to the result, the faster this method
     *           will run.
     * @param c the comparator used to order the range, and to search
     * @return the int k, 0 <= k <= n such that a[b + k - 1] <= key < a[b + k]
     */
    function gallopRight (key, a, base, len, hint,  compare) {

        var ofs = 1;
        var lastOfs = 0;
        if (compare(key, a[base + hint]) < 0) {
            // Gallop left until a[b+hint - ofs] <= key < a[b+hint - lastOfs]
            var maxOfs = hint + 1;
            while (ofs < maxOfs && compare(key, a[base + hint - ofs]) < 0) {
                lastOfs = ofs;
                ofs = (ofs << 1) + 1;
                if (ofs <= 0) // int overflow
                    ofs = maxOfs;
            }
            if (ofs > maxOfs) ofs = maxOfs;

            // Make offsets relative to b
            var tmp = lastOfs;
            lastOfs = hint - ofs;
            ofs = hint - tmp;
        } else { // a[b + hint] <= key
            // Gallop right until a[b+hint + lastOfs] <= key < a[b+hint + ofs]
            var maxOfs = len - hint;
            while (ofs < maxOfs && compare(key, a[base + hint + ofs]) >= 0) {
                lastOfs = ofs;
                ofs = (ofs << 1) + 1;
                if (ofs <= 0) // int overflow
                    ofs = maxOfs;
            }
            if (ofs > maxOfs) ofs = maxOfs;

            // Make offsets relative to b
            lastOfs += hint;
            ofs += hint;
        }

        /*
        * Now a[b + lastOfs] <= key < a[b + ofs], so key belongs somewhere to the right of lastOfs but no farther right than ofs.
        * Do a binary search, with invariant a[b + lastOfs - 1] <= key < a[b + ofs].
        */
        lastOfs++;
        while (lastOfs < ofs) {
            var m = lastOfs + ((ofs - lastOfs) >>> 1);

            if (compare(key, a[base + m]) < 0)
                ofs = m; // key < a[b + m]
            else
                lastOfs = m + 1; // a[b + m] <= key
        }
        return ofs;
    }

    /**
     * Merges two adjacent runs in place, in a stable fashion. The first element of the first run must be greater than the first
     * element of the second run (a[base1] > a[base2]), and the last element of the first run (a[base1 + len1-1]) must be greater
     * than all elements of the second run.
     *
     * For performance, this method should be called only when len1 <= len2; its twin, mergeHi should be called if len1 >= len2.
     * (Either method may be called if len1 == len2.)
     *
     * @param base1 index of first element in first run to be merged
     * @param len1 length of first run to be merged (must be > 0)
     * @param base2 index of first element in second run to be merged (must be aBase + aLen)
     * @param len2 length of second run to be merged (must be > 0)
     */
    function mergeLo (base1, len1, base2, len2) {

        // Copy first run into temp array
        var a = global_a;// For performance
        var tmp=a.slice(base1,base1+len1);

        var cursor1 = 0; // Indexes into tmp array
        var cursor2 = base2; // Indexes int a
        var dest = base1; // Indexes int a

        // Move first element of second run and deal with degenerate cases
        a[dest++] = a[cursor2++];
        if (--len2 == 0) {
            arraycopy(tmp, cursor1, a, dest, len1);
            return;
        }
        if (len1 == 1) {
            arraycopy(a, cursor2, a, dest, len2);
            a[dest + len2] = tmp[cursor1]; // Last elt of run 1 to end of merge
            return;
        }

        var c = compare;// Use local variable for performance

        var minGallop = MIN_GALLOP; // "    " "     " "
        outer:
            while (true) {
                var count1 = 0; // Number of times in a row that first run won
                var count2 = 0; // Number of times in a row that second run won

                /*
                * Do the straightforward thing until (if ever) one run starts winning consistently.
                */
                do {
                    if (compare(a[cursor2], tmp[cursor1]) < 0) {
                        a[dest++] = a[cursor2++];
                        count2++;
                        count1 = 0;
                        if (--len2 == 0) break outer;
                    } else {
                        a[dest++] = tmp[cursor1++];
                        count1++;
                        count2 = 0;
                        if (--len1 == 1) break outer;
                    }
                } while ((count1 | count2) < minGallop);

                /*
                * One run is winning so consistently that galloping may be a huge win. So try that, and continue galloping until (if
                * ever) neither run appears to be winning consistently anymore.
                */
                do {
                    count1 = gallopRight(a[cursor2], tmp, cursor1, len1, 0, c);
                    if (count1 != 0) {
                        arraycopy(tmp, cursor1, a, dest, count1);
                        dest += count1;
                        cursor1 += count1;
                        len1 -= count1;
                        if (len1 <= 1) // len1 == 1 || len1 == 0
                            break outer;
                    }
                    a[dest++] = a[cursor2++];
                    if (--len2 == 0) break outer;

                    count2 = gallopLeft(tmp[cursor1], a, cursor2, len2, 0, c);
                    if (count2 != 0) {
                        arraycopy(a, cursor2, a, dest, count2);
                        dest += count2;
                        cursor2 += count2;
                        len2 -= count2;
                        if (len2 == 0) break outer;
                    }
                    a[dest++] = tmp[cursor1++];
                    if (--len1 == 1) break outer;
                    minGallop--;
                } while (count1 >= MIN_GALLOP | count2 >= MIN_GALLOP);
                if (minGallop < 0) minGallop = 0;
                minGallop += 2; // Penalize for leaving gallop mode
            } // End of "outer" loop
        this.minGallop = minGallop < 1 ? 1 : minGallop; // Write back to field

        if (len1 == 1) {
            arraycopy(a, cursor2, a, dest, len2);
            a[dest + len2] = tmp[cursor1]; // Last elt of run 1 to end of merge
        } else if (len1 == 0) {
            throw new Error("IllegalArgumentException. Comparison method violates its general contract!");
        } else {
            arraycopy(tmp, cursor1, a, dest, len1);
        }
    }


    /**
     * Like mergeLo, except that this method should be called only if len1 >= len2; mergeLo should be called if len1 <= len2.
     * (Either method may be called if len1 == len2.)
     *
     * @param base1 index of first element in first run to be merged
     * @param len1 length of first run to be merged (must be > 0)
     * @param base2 index of first element in second run to be merged (must be aBase + aLen)
     * @param len2 length of second run to be merged (must be > 0)
     */
    function mergeHi ( base1, len1, base2, len2) {

        // Copy second run into temp array
        var a = global_a;// For performance
        var tmp=a.slice(base2, base2+len2);

        var cursor1 = base1 + len1 - 1; // Indexes into a
        var cursor2 = len2 - 1; // Indexes into tmp array
        var dest = base2 + len2 - 1; // Indexes into a

        // Move last element of first run and deal with degenerate cases
        a[dest--] = a[cursor1--];
        if (--len1 == 0) {
            arraycopy(tmp, 0, a, dest - (len2 - 1), len2);
            return;
        }
        if (len2 == 1) {
            dest -= len1;
            cursor1 -= len1;
            arraycopy(a, cursor1 + 1, a, dest + 1, len1);
            a[dest] = tmp[cursor2];
            return;
        }

        var c = compare;// Use local variable for performance

        var minGallop = MIN_GALLOP; // "    " "     " "
        outer:
            while (true) {
                var count1 = 0; // Number of times in a row that first run won
                var count2 = 0; // Number of times in a row that second run won

                /*
                * Do the straightforward thing until (if ever) one run appears to win consistently.
                */
                do {
                    if (compare(tmp[cursor2], a[cursor1]) < 0) {
                        a[dest--] = a[cursor1--];
                        count1++;
                        count2 = 0;
                        if (--len1 == 0) break outer;
                    } else {
                        a[dest--] = tmp[cursor2--];
                        count2++;
                        count1 = 0;
                        if (--len2 == 1) break outer;
                    }
                } while ((count1 | count2) < minGallop);

                /*
                * One run is winning so consistently that galloping may be a huge win. So try that, and continue galloping until (if
                * ever) neither run appears to be winning consistently anymore.
                */
                do {
                    count1 = len1 - gallopRight(tmp[cursor2], a, base1, len1, len1 - 1, c);
                    if (count1 != 0) {
                        dest -= count1;
                        cursor1 -= count1;
                        len1 -= count1;
                        arraycopy(a, cursor1 + 1, a, dest + 1, count1);
                        if (len1 == 0) break outer;
                    }
                    a[dest--] = tmp[cursor2--];
                    if (--len2 == 1) break outer;

                    count2 = len2 - gallopLeft(a[cursor1], tmp, 0, len2, len2 - 1, c);
                    if (count2 != 0) {
                        dest -= count2;
                        cursor2 -= count2;
                        len2 -= count2;
                        arraycopy(tmp, cursor2 + 1, a, dest + 1, count2);
                        if (len2 <= 1) // len2 == 1 || len2 == 0
                            break outer;
                    }
                    a[dest--] = a[cursor1--];
                    if (--len1 == 0) break outer;
                    minGallop--;
                } while (count1 >= MIN_GALLOP | count2 >= MIN_GALLOP);
                if (minGallop < 0) minGallop = 0;
                minGallop += 2; // Penalize for leaving gallop mode
            } // End of "outer" loop
        this.minGallop = minGallop < 1 ? 1 : minGallop; // Write back to field

        if (len2 == 1) {
            dest -= len1;
            cursor1 -= len1;
            arraycopy(a, cursor1 + 1, a, dest + 1, len1);
            a[dest] = tmp[cursor2]; // Move first elt of run2 to front of merge
        } else if (len2 == 0) {
            throw new Error("IllegalArgumentException. Comparison method violates its general contract!");
        } else {
            arraycopy(tmp, 0, a, dest - (len2 - 1), len2);
        }
    }


    /**
     * Checks that fromIndex and toIndex are in range, and throws an appropriate exception if they aren't.
     *
     * @param arrayLen the length of the array
     * @param fromIndex the index of the first element of the range
     * @param toIndex the index after the last element of the range
     * @throws IllegalArgumentException if fromIndex > toIndex
     * @throws ArrayIndexOutOfBoundsException if fromIndex < 0 or toIndex > arrayLen
     */
    function rangeCheck (arrayLen, fromIndex, toIndex) {
        if (fromIndex > toIndex) throw new Error( "IllegalArgument fromIndex(" + fromIndex + ") > toIndex(" + toIndex + ")");
        if (fromIndex < 0) throw new Error( "ArrayIndexOutOfBounds "+fromIndex);
        if (toIndex > arrayLen) throw new Error( "ArrayIndexOutOfBounds "+toIndex);
    }
}

// java System.arraycopy(Object src, int srcPos, Object dest, int destPos, int length)
function arraycopy(s,spos,d,dpos,len){
    var a=s.slice(spos,spos+len);
    while(len--){
        d[dpos+len]=a[len];
    }
}














runDefaultSort(someArr);
richSort(someArr);
librarianBasedSort(someArr, 3);
runQuickSort(someArr);
runMergeSort(someArr);
runTimSort(someArr);
heapSort(someArr);
bubbleSort(someArr);
insertionSort(someArr);
selectionSort(someArr);

