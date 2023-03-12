/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/util/worker-word-finder.js":
/*!****************************************!*\
  !*** ./src/util/worker-word-finder.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nconst findWords = (board, dictionary) => {\r\n    for(let wordLength = 3; wordLength < board.length; wordLength++) {\r\n        for(const comb of board) {\r\n            addComb(board, comb, [], wordLength, dictionary)\r\n        }\r\n    }\r\n}\r\n\r\nconst addComb = (board, comb, currentWord, wordLength, dictionary) => {\r\n    currentWord.push(comb);\r\n    if(currentWord.length === wordLength) {\r\n        evaluateWord(currentWord, dictionary);\r\n        currentWord.pop();\r\n        return;\r\n    }\r\n    validNeighbours(board, comb, currentWord).forEach(next => {\r\n        addComb(board, next, currentWord, wordLength, dictionary)\r\n    });\r\n    currentWord.pop();\r\n}\r\n\r\nconst evaluateWord = (currentWord, dictionary) => {\r\n    const word = currentWord.reduce((prev, cur) => prev + cur.letter, '');\r\n    if(!!find(dictionary, word)) {\r\n        postMessage({ word: word, combs: currentWord });\r\n    };\r\n}\r\n\r\nconst validNeighbours = (board, comb, currentWord) => {\r\n    return board.filter(next => {\r\n        if(next === comb) return false;\r\n        if(Math.abs(next.x - comb.x) > 1 || Math.abs(next.y - comb.y) > 1) return false;\r\n        if(currentWord.find(c => c === next)) return false;\r\n        return true;\r\n    });\r\n}\r\n\r\nconst find = (dictionary, value) => {\r\n    if(dictionary.value === value) {\r\n        return value;\r\n    }\r\n    if(dictionary.value < value) {\r\n        if(!dictionary.right) return null;\r\n        return find(dictionary.right, value);\r\n    }\r\n    if(!dictionary.left) return null;\r\n    return find(dictionary.left, value);\r\n}\r\n\r\nlet dictionary;\r\n\r\nonmessage = (event) => {\r\n    findWords(event.data.board, event.data.dictionary);\r\n}\r\n\n\n//# sourceURL=webpack://bogglemon/./src/util/worker-word-finder.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/util/worker-word-finder.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;