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

/***/ "./src/js/mapHome.js":
/*!***************************!*\
  !*** ./src/js/mapHome.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n;(function () {\n  const lat = 10.3371022\n  const lng = -68.7335184\n  const map = L.map('map-home').setView([lat, lng], 13)\n  let markers = new L.FeatureGroup().addTo(map)\n  let properties = []\n\n  // Filters\n  const filters = {\n    category: '',\n    price: ''\n  }\n\n  const categories = document.querySelector('#categories')\n  const prices = document.querySelector('#prices')\n\n  categories.addEventListener('change', (e) => {\n    filters.category = Number(e.target.value)\n    filterProperties()\n  })\n  prices.addEventListener('change', (e) => {\n    filters.price = Number(e.target.value)\n    filterProperties()\n  })\n\n  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n    attribution:\n      '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n  }).addTo(map)\n\n  const listProperties = async () => {\n    try {\n      const url = '/api/properties'\n      const result = await fetch(url)\n      properties = await result.json()\n      showProperties(properties)\n    } catch (error) {\n      console.log(error)\n    }\n  }\n\n  const showProperties = async (properties) => {\n    // Clean previous markers\n    markers.clearLayers()\n\n    properties.forEach((property) => {\n      // Add pins\n      const marker = new L.marker([property?.lat, property?.lng], {\n        autoPan: true\n      }).addTo(map).bindPopup(`\n      <p class=\"text-indigo-600 font-bold\">${property.category.name}</p>\n        <h1 class=\"text-xl font-extrabold uppercase my-2\">${property?.title}</h1>\n        <img src=\"/uploads/${property?.image}\" alt=\"Imagen de ${property.title}\">\n        <p class=\"text-gray-600 font-bold\">${property.price.range}</p>\n        <a href=\"/properties/${property?.id}\" class=\"block bg-indigo-600 hover:bg-indigo-700 text-center font-bold uppercase py-2 px-4 rounded-md\">\n          <span class=\"text-white\">Ver Propiedad</span></a>\n        `)\n\n      markers.addLayer(marker)\n    })\n  }\n\n  const filterProperties = () => {\n    const result = properties.filter(filterByCategory).filter(filterByPrice)\n    showProperties(result)\n  }\n\n  const filterByCategory = (property) => {\n    return filters.category\n      ? property.categoryId === filters.category\n      : property\n  }\n\n  const filterByPrice = (property) => {\n    return filters.price ? property.priceId === filters.price : property\n  }\n\n  listProperties()\n})()\n\n\n//# sourceURL=webpack://realstate/./src/js/mapHome.js?");

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
/******/ 	__webpack_modules__["./src/js/mapHome.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;