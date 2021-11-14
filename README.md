# Rich Sort
#### This package adds to Array.prototype new method `.richSort()` for sorting array of numbers
<br>

### Installation of package:
```
npm i rich-sort --save
```
<br>

### Usage with Angular
#### Just add to the "scripts" section of angular.json file following code:
```
"scripts": [
    "node_modules/rich-sort/rich-sort.js"
]
```
<br>

### Example of usage:
```
const arr = [3, 5, 2, 1, 33, 16, 11, 7, 8, 12, 20];

(arr as any).richSort();
```
#### or
```
const arr = [3, 5, 2, 1, 33, 16, 11, 7, 8, 12, 20];
        
(arr as any).richSort((a, b) => {
    return b - a;
});
```
