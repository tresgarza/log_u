/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/head */ \"next/head\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! styled-components */ \"styled-components\");\n/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _styles_GlobalStyle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../styles/GlobalStyle */ \"./styles/GlobalStyle.ts\");\n/* harmony import */ var _styles_theme__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../styles/theme */ \"./styles/theme.ts\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_7__);\n\n\n\n\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    // Track page views and prevent unnecessary refreshes\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const handleRouteChange = (url)=>{\n            console.log(`App is navigating to: ${url}`);\n        };\n        router.events.on(\"routeChangeStart\", handleRouteChange);\n        // Prevent the browser from scrolling to the top on route changes\n        if (false) {}\n        return ()=>{\n            router.events.off(\"routeChangeStart\", handleRouteChange);\n        };\n    }, [\n        router\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(styled_components__WEBPACK_IMPORTED_MODULE_4__.ThemeProvider, {\n        theme: _styles_theme__WEBPACK_IMPORTED_MODULE_6__[\"default\"],\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_styles_GlobalStyle__WEBPACK_IMPORTED_MODULE_5__.GlobalStyle, {}, void 0, false, {\n                fileName: \"/Users/diegogg98/DGMX CURSOR/simple-qr/logu-mvp/frontend/pages/_app.tsx\",\n                lineNumber: 33,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_2___default()), {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"viewport\",\n                        content: \"width=device-width, initial-scale=1.0\"\n                    }, void 0, false, {\n                        fileName: \"/Users/diegogg98/DGMX CURSOR/simple-qr/logu-mvp/frontend/pages/_app.tsx\",\n                        lineNumber: 35,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"theme-color\",\n                        content: \"#4F46E5\"\n                    }, void 0, false, {\n                        fileName: \"/Users/diegogg98/DGMX CURSOR/simple-qr/logu-mvp/frontend/pages/_app.tsx\",\n                        lineNumber: 36,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"icon\",\n                        href: \"/favicon.ico\"\n                    }, void 0, false, {\n                        fileName: \"/Users/diegogg98/DGMX CURSOR/simple-qr/logu-mvp/frontend/pages/_app.tsx\",\n                        lineNumber: 37,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/diegogg98/DGMX CURSOR/simple-qr/logu-mvp/frontend/pages/_app.tsx\",\n                lineNumber: 34,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                id: \"page-transition-indicator\",\n                className: \"page-transition-indicator\"\n            }, void 0, false, {\n                fileName: \"/Users/diegogg98/DGMX CURSOR/simple-qr/logu-mvp/frontend/pages/_app.tsx\",\n                lineNumber: 41,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"app-container\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/Users/diegogg98/DGMX CURSOR/simple-qr/logu-mvp/frontend/pages/_app.tsx\",\n                    lineNumber: 45,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/diegogg98/DGMX CURSOR/simple-qr/logu-mvp/frontend/pages/_app.tsx\",\n                lineNumber: 44,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/diegogg98/DGMX CURSOR/simple-qr/logu-mvp/frontend/pages/_app.tsx\",\n        lineNumber: 32,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXlDO0FBRVo7QUFDVztBQUNVO0FBQ0U7QUFDaEI7QUFDTDtBQUUvQixTQUFTTyxNQUFNLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBQy9DLE1BQU1DLFNBQVNQLHNEQUFTQTtJQUV4QixxREFBcUQ7SUFDckRGLGdEQUFTQSxDQUFDO1FBQ1IsTUFBTVUsb0JBQW9CLENBQUNDO1lBQ3pCQyxRQUFRQyxHQUFHLENBQUMsQ0FBQyxzQkFBc0IsRUFBRUYsSUFBSSxDQUFDO1FBQzVDO1FBRUFGLE9BQU9LLE1BQU0sQ0FBQ0MsRUFBRSxDQUFDLG9CQUFvQkw7UUFFckMsaUVBQWlFO1FBQ2pFLElBQUksS0FBa0IsRUFBYSxFQUVsQztRQUVELE9BQU87WUFDTEQsT0FBT0ssTUFBTSxDQUFDSyxHQUFHLENBQUMsb0JBQW9CVDtRQUN4QztJQUNGLEdBQUc7UUFBQ0Q7S0FBTztJQUVYLHFCQUNFLDhEQUFDTiw0REFBYUE7UUFBQ0UsT0FBT0EscURBQUtBOzswQkFDekIsOERBQUNELDREQUFXQTs7Ozs7MEJBQ1osOERBQUNILGtEQUFJQTs7a0NBQ0gsOERBQUNtQjt3QkFBS0MsTUFBSzt3QkFBV0MsU0FBUTs7Ozs7O2tDQUM5Qiw4REFBQ0Y7d0JBQUtDLE1BQUs7d0JBQWNDLFNBQVE7Ozs7OztrQ0FDakMsOERBQUNDO3dCQUFLQyxLQUFJO3dCQUFPQyxNQUFLOzs7Ozs7Ozs7Ozs7MEJBSXhCLDhEQUFDQztnQkFBSUMsSUFBRztnQkFBNEJDLFdBQVU7Ozs7OzswQkFHOUMsOERBQUNGO2dCQUFJRSxXQUFVOzBCQUNiLDRFQUFDckI7b0JBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJaEM7QUFFQSxpRUFBZUYsS0FBS0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2xvZ3UtZnJvbnRlbmQvLi9wYWdlcy9fYXBwLnRzeD8yZmJlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnO1xuaW1wb3J0IEhlYWQgZnJvbSAnbmV4dC9oZWFkJztcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgeyBHbG9iYWxTdHlsZSB9IGZyb20gJy4uL3N0eWxlcy9HbG9iYWxTdHlsZSc7XG5pbXBvcnQgdGhlbWUgZnJvbSAnLi4vc3R5bGVzL3RoZW1lJztcbmltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcblxuZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKTtcbiAgXG4gIC8vIFRyYWNrIHBhZ2Ugdmlld3MgYW5kIHByZXZlbnQgdW5uZWNlc3NhcnkgcmVmcmVzaGVzXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgaGFuZGxlUm91dGVDaGFuZ2UgPSAodXJsOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGBBcHAgaXMgbmF2aWdhdGluZyB0bzogJHt1cmx9YCk7XG4gICAgfTtcblxuICAgIHJvdXRlci5ldmVudHMub24oJ3JvdXRlQ2hhbmdlU3RhcnQnLCBoYW5kbGVSb3V0ZUNoYW5nZSk7XG4gICAgXG4gICAgLy8gUHJldmVudCB0aGUgYnJvd3NlciBmcm9tIHNjcm9sbGluZyB0byB0aGUgdG9wIG9uIHJvdXRlIGNoYW5nZXNcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHdpbmRvdy5oaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gJ21hbnVhbCc7XG4gICAgfVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHJvdXRlci5ldmVudHMub2ZmKCdyb3V0ZUNoYW5nZVN0YXJ0JywgaGFuZGxlUm91dGVDaGFuZ2UpO1xuICAgIH07XG4gIH0sIFtyb3V0ZXJdKTtcblxuICByZXR1cm4gKFxuICAgIDxUaGVtZVByb3ZpZGVyIHRoZW1lPXt0aGVtZX0+XG4gICAgICA8R2xvYmFsU3R5bGUgLz5cbiAgICAgIDxIZWFkPlxuICAgICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMFwiIC8+XG4gICAgICAgIDxtZXRhIG5hbWU9XCJ0aGVtZS1jb2xvclwiIGNvbnRlbnQ9XCIjNEY0NkU1XCIgLz5cbiAgICAgICAgPGxpbmsgcmVsPVwiaWNvblwiIGhyZWY9XCIvZmF2aWNvbi5pY29cIiAvPlxuICAgICAgPC9IZWFkPlxuICAgICAgXG4gICAgICB7LyogQWRkIGEgZ2xvYmFsIGxvYWRpbmcgaW5kaWNhdG9yICovfVxuICAgICAgPGRpdiBpZD1cInBhZ2UtdHJhbnNpdGlvbi1pbmRpY2F0b3JcIiBjbGFzc05hbWU9XCJwYWdlLXRyYW5zaXRpb24taW5kaWNhdG9yXCIgLz5cbiAgICAgIFxuICAgICAgey8qIE1haW4gYXBwIGNvbnRhaW5lciAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXBwLWNvbnRhaW5lclwiPlxuICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L1RoZW1lUHJvdmlkZXI+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IE15QXBwOyAiXSwibmFtZXMiOlsiUmVhY3QiLCJ1c2VFZmZlY3QiLCJIZWFkIiwidXNlUm91dGVyIiwiVGhlbWVQcm92aWRlciIsIkdsb2JhbFN0eWxlIiwidGhlbWUiLCJNeUFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsInJvdXRlciIsImhhbmRsZVJvdXRlQ2hhbmdlIiwidXJsIiwiY29uc29sZSIsImxvZyIsImV2ZW50cyIsIm9uIiwid2luZG93IiwiaGlzdG9yeSIsInNjcm9sbFJlc3RvcmF0aW9uIiwib2ZmIiwibWV0YSIsIm5hbWUiLCJjb250ZW50IiwibGluayIsInJlbCIsImhyZWYiLCJkaXYiLCJpZCIsImNsYXNzTmFtZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/GlobalStyle.ts":
/*!*******************************!*\
  !*** ./styles/GlobalStyle.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GlobalStyle: () => (/* binding */ GlobalStyle)\n/* harmony export */ });\n/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ \"styled-components\");\n/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_0__);\n\nconst GlobalStyle = (0,styled_components__WEBPACK_IMPORTED_MODULE_0__.createGlobalStyle)([\n    \"*{margin:0;padding:0;box-sizing:border-box;}html,body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;background-color:\",\n    \";color:\",\n    \";}a{color:inherit;text-decoration:none;}button{cursor:pointer;}ul{list-style:none;}img{max-width:100%;display:block;}\"\n], (props)=>props.theme.colors.background.primary, (props)=>props.theme.colors.text.primary);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zdHlsZXMvR2xvYmFsU3R5bGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXNEO0FBRS9DLE1BQU1DLGNBQWNELG9FQUFpQkE7Ozs7R0FXcEJFLENBQUFBLFFBQVNBLE1BQU1DLEtBQUssQ0FBQ0MsTUFBTSxDQUFDQyxVQUFVLENBQUNDLE9BQU8sRUFDekRKLENBQUFBLFFBQVNBLE1BQU1DLEtBQUssQ0FBQ0MsTUFBTSxDQUFDRyxJQUFJLENBQUNELE9BQU8sRUFvQm5EIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbG9ndS1mcm9udGVuZC8uL3N0eWxlcy9HbG9iYWxTdHlsZS50cz80YmEwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUdsb2JhbFN0eWxlIH0gZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgY29uc3QgR2xvYmFsU3R5bGUgPSBjcmVhdGVHbG9iYWxTdHlsZWBcbiAgKiB7XG4gICAgbWFyZ2luOiAwO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgfVxuXG4gIGh0bWwsXG4gIGJvZHkge1xuICAgIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsIFJvYm90bywgT3h5Z2VuLFxuICAgICAgVWJ1bnR1LCBDYW50YXJlbGwsICdPcGVuIFNhbnMnLCAnSGVsdmV0aWNhIE5ldWUnLCBzYW5zLXNlcmlmO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuY29sb3JzLmJhY2tncm91bmQucHJpbWFyeX07XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuY29sb3JzLnRleHQucHJpbWFyeX07XG4gIH1cblxuICBhIHtcbiAgICBjb2xvcjogaW5oZXJpdDtcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIH1cblxuICBidXR0b24ge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgfVxuXG4gIHVsIHtcbiAgICBsaXN0LXN0eWxlOiBub25lO1xuICB9XG5cbiAgaW1nIHtcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gIH1cbmA7ICJdLCJuYW1lcyI6WyJjcmVhdGVHbG9iYWxTdHlsZSIsIkdsb2JhbFN0eWxlIiwicHJvcHMiLCJ0aGVtZSIsImNvbG9ycyIsImJhY2tncm91bmQiLCJwcmltYXJ5IiwidGV4dCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./styles/GlobalStyle.ts\n");

/***/ }),

/***/ "./styles/theme.ts":
/*!*************************!*\
  !*** ./styles/theme.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst theme = {\n    colors: {\n        primary: \"#0066FF\",\n        primaryDark: \"#0052CC\",\n        secondary: \"#6C757D\",\n        success: \"#28A745\",\n        warning: \"#FFC107\",\n        error: \"#DC3545\",\n        info: \"#17A2B8\",\n        accent: \"#4F46E5\",\n        text: {\n            dark: \"#1A1A1A\",\n            light: \"#F8F9FA\",\n            gray: \"#6C757D\",\n            primary: \"#1A1A1A\",\n            secondary: \"#6C757D\",\n            muted: \"#A0AEC0\"\n        },\n        textLight: \"#6C757D\",\n        background: {\n            primary: \"#FFFFFF\",\n            secondary: \"#F8F9FA\",\n            light: \"#FFFFFF\",\n            gray: \"#F5F5F5\"\n        },\n        background2: \"#F0F0F0\",\n        border: {\n            default: \"#DEE2E6\",\n            light: \"#E9ECEF\"\n        },\n        light: \"#F8F9FA\",\n        status: {\n            success: \"#28A745\",\n            error: \"#DC3545\",\n            warning: \"#FFC107\",\n            info: \"#17A2B8\"\n        },\n        gradient: {\n            primary: \"linear-gradient(135deg, #0066FF 0%, #0052CC 100%)\",\n            secondary: \"linear-gradient(135deg, #6C757D 0%, #495057 100%)\"\n        },\n        gray: {\n            200: \"#E9ECEF\",\n            500: \"#6C757D\"\n        }\n    },\n    breakpoints: {\n        sm: \"576px\",\n        md: \"768px\",\n        lg: \"992px\",\n        xl: \"1200px\"\n    },\n    spacing: {\n        xs: \"0.25rem\",\n        sm: \"0.5rem\",\n        md: \"1rem\",\n        lg: \"1.5rem\",\n        xl: \"2rem\"\n    },\n    shadows: {\n        sm: \"0 1px 2px rgba(0, 0, 0, 0.05)\",\n        md: \"0 4px 6px rgba(0, 0, 0, 0.05)\",\n        lg: \"0 10px 15px rgba(0, 0, 0, 0.05)\",\n        xl: \"0 20px 25px rgba(0, 0, 0, 0.05)\"\n    },\n    typography: {\n        fontFamily: {\n            primary: '-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif',\n            secondary: '\"SF Pro Display\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif'\n        },\n        fontSize: {\n            xs: \"0.75rem\",\n            sm: \"0.875rem\",\n            md: \"1rem\",\n            lg: \"1.125rem\",\n            xl: \"1.25rem\",\n            \"3xl\": \"2rem\"\n        },\n        fontWeight: {\n            regular: 400,\n            medium: 500,\n            semibold: 600,\n            bold: 700\n        }\n    },\n    borderRadius: {\n        sm: \"0.25rem\",\n        md: \"0.5rem\",\n        lg: \"1rem\",\n        xl: \"2rem\",\n        full: \"9999px\"\n    },\n    fontSizes: {\n        xs: \"0.75rem\",\n        sm: \"0.875rem\",\n        md: \"1rem\",\n        lg: \"1.125rem\",\n        xl: \"1.25rem\",\n        \"2xl\": \"1.5rem\",\n        \"3xl\": \"2rem\",\n        \"4xl\": \"2.5rem\"\n    },\n    fontWeights: {\n        regular: 400,\n        medium: 500,\n        semibold: 600,\n        bold: 700\n    },\n    zIndices: {\n        sticky: 100,\n        docked: 10,\n        dropdown: 1000,\n        overlay: 2000\n    },\n    transitions: {\n        base: \"0.3s ease-in-out\",\n        fast: \"0.15s ease-in-out\"\n    }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (theme);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zdHlsZXMvdGhlbWUudHMiLCJtYXBwaW5ncyI6Ijs7OztBQUVBLE1BQU1BLFFBQXNCO0lBQzFCQyxRQUFRO1FBQ05DLFNBQVM7UUFDVEMsYUFBYTtRQUNiQyxXQUFXO1FBQ1hDLFNBQVM7UUFDVEMsU0FBUztRQUNUQyxPQUFPO1FBQ1BDLE1BQU07UUFDTkMsUUFBUTtRQUNSQyxNQUFNO1lBQ0pDLE1BQU07WUFDTkMsT0FBTztZQUNQQyxNQUFNO1lBQ05YLFNBQVM7WUFDVEUsV0FBVztZQUNYVSxPQUFPO1FBQ1Q7UUFDQUMsV0FBVztRQUNYQyxZQUFZO1lBQ1ZkLFNBQVM7WUFDVEUsV0FBVztZQUNYUSxPQUFPO1lBQ1BDLE1BQU07UUFDUjtRQUNBSSxhQUFhO1FBQ2JDLFFBQVE7WUFDTkMsU0FBUztZQUNUUCxPQUFPO1FBQ1Q7UUFDQUEsT0FBTztRQUNQUSxRQUFRO1lBQ05mLFNBQVM7WUFDVEUsT0FBTztZQUNQRCxTQUFTO1lBQ1RFLE1BQU07UUFDUjtRQUNBYSxVQUFVO1lBQ1JuQixTQUFTO1lBQ1RFLFdBQVc7UUFDYjtRQUNBUyxNQUFNO1lBQ0osS0FBSztZQUNMLEtBQUs7UUFDUDtJQUNGO0lBQ0FTLGFBQWE7UUFDWEMsSUFBSTtRQUNKQyxJQUFJO1FBQ0pDLElBQUk7UUFDSkMsSUFBSTtJQUNOO0lBQ0FDLFNBQVM7UUFDUEMsSUFBSTtRQUNKTCxJQUFJO1FBQ0pDLElBQUk7UUFDSkMsSUFBSTtRQUNKQyxJQUFJO0lBQ047SUFDQUcsU0FBUztRQUNQTixJQUFJO1FBQ0pDLElBQUk7UUFDSkMsSUFBSTtRQUNKQyxJQUFJO0lBQ047SUFDQUksWUFBWTtRQUNWQyxZQUFZO1lBQ1Y3QixTQUFTO1lBQ1RFLFdBQVc7UUFDYjtRQUNBNEIsVUFBVTtZQUNSSixJQUFJO1lBQ0pMLElBQUk7WUFDSkMsSUFBSTtZQUNKQyxJQUFJO1lBQ0pDLElBQUk7WUFDSixPQUFPO1FBQ1Q7UUFDQU8sWUFBWTtZQUNWQyxTQUFTO1lBQ1RDLFFBQVE7WUFDUkMsVUFBVTtZQUNWQyxNQUFNO1FBQ1I7SUFDRjtJQUNBQyxjQUFjO1FBQ1pmLElBQUk7UUFDSkMsSUFBSTtRQUNKQyxJQUFJO1FBQ0pDLElBQUk7UUFDSmEsTUFBTTtJQUNSO0lBQ0FDLFdBQVc7UUFDVFosSUFBSTtRQUNKTCxJQUFJO1FBQ0pDLElBQUk7UUFDSkMsSUFBSTtRQUNKQyxJQUFJO1FBQ0osT0FBTztRQUNQLE9BQU87UUFDUCxPQUFPO0lBQ1Q7SUFDQWUsYUFBYTtRQUNYUCxTQUFTO1FBQ1RDLFFBQVE7UUFDUkMsVUFBVTtRQUNWQyxNQUFNO0lBQ1I7SUFDQUssVUFBVTtRQUNSQyxRQUFRO1FBQ1JDLFFBQVE7UUFDUkMsVUFBVTtRQUNWQyxTQUFTO0lBQ1g7SUFDQUMsYUFBYTtRQUNYQyxNQUFNO1FBQ05DLE1BQU07SUFDUjtBQUNGO0FBRUEsaUVBQWVqRCxLQUFLQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbG9ndS1mcm9udGVuZC8uL3N0eWxlcy90aGVtZS50cz82OTZiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERlZmF1bHRUaGVtZSB9IGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgdGhlbWU6IERlZmF1bHRUaGVtZSA9IHtcbiAgY29sb3JzOiB7XG4gICAgcHJpbWFyeTogJyMwMDY2RkYnLFxuICAgIHByaW1hcnlEYXJrOiAnIzAwNTJDQycsXG4gICAgc2Vjb25kYXJ5OiAnIzZDNzU3RCcsXG4gICAgc3VjY2VzczogJyMyOEE3NDUnLFxuICAgIHdhcm5pbmc6ICcjRkZDMTA3JyxcbiAgICBlcnJvcjogJyNEQzM1NDUnLFxuICAgIGluZm86ICcjMTdBMkI4JyxcbiAgICBhY2NlbnQ6ICcjNEY0NkU1JyxcbiAgICB0ZXh0OiB7XG4gICAgICBkYXJrOiAnIzFBMUExQScsXG4gICAgICBsaWdodDogJyNGOEY5RkEnLFxuICAgICAgZ3JheTogJyM2Qzc1N0QnLFxuICAgICAgcHJpbWFyeTogJyMxQTFBMUEnLFxuICAgICAgc2Vjb25kYXJ5OiAnIzZDNzU3RCcsXG4gICAgICBtdXRlZDogJyNBMEFFQzAnXG4gICAgfSxcbiAgICB0ZXh0TGlnaHQ6ICcjNkM3NTdEJyxcbiAgICBiYWNrZ3JvdW5kOiB7XG4gICAgICBwcmltYXJ5OiAnI0ZGRkZGRicsXG4gICAgICBzZWNvbmRhcnk6ICcjRjhGOUZBJyxcbiAgICAgIGxpZ2h0OiAnI0ZGRkZGRicsXG4gICAgICBncmF5OiAnI0Y1RjVGNSdcbiAgICB9LFxuICAgIGJhY2tncm91bmQyOiAnI0YwRjBGMCcsXG4gICAgYm9yZGVyOiB7XG4gICAgICBkZWZhdWx0OiAnI0RFRTJFNicsXG4gICAgICBsaWdodDogJyNFOUVDRUYnXG4gICAgfSxcbiAgICBsaWdodDogJyNGOEY5RkEnLFxuICAgIHN0YXR1czoge1xuICAgICAgc3VjY2VzczogJyMyOEE3NDUnLFxuICAgICAgZXJyb3I6ICcjREMzNTQ1JyxcbiAgICAgIHdhcm5pbmc6ICcjRkZDMTA3JyxcbiAgICAgIGluZm86ICcjMTdBMkI4J1xuICAgIH0sXG4gICAgZ3JhZGllbnQ6IHtcbiAgICAgIHByaW1hcnk6ICdsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMDA2NkZGIDAlLCAjMDA1MkNDIDEwMCUpJyxcbiAgICAgIHNlY29uZGFyeTogJ2xpbmVhci1ncmFkaWVudCgxMzVkZWcsICM2Qzc1N0QgMCUsICM0OTUwNTcgMTAwJSknXG4gICAgfSxcbiAgICBncmF5OiB7XG4gICAgICAyMDA6ICcjRTlFQ0VGJyxcbiAgICAgIDUwMDogJyM2Qzc1N0QnXG4gICAgfVxuICB9LFxuICBicmVha3BvaW50czoge1xuICAgIHNtOiAnNTc2cHgnLFxuICAgIG1kOiAnNzY4cHgnLFxuICAgIGxnOiAnOTkycHgnLFxuICAgIHhsOiAnMTIwMHB4JyxcbiAgfSxcbiAgc3BhY2luZzoge1xuICAgIHhzOiAnMC4yNXJlbScsXG4gICAgc206ICcwLjVyZW0nLFxuICAgIG1kOiAnMXJlbScsXG4gICAgbGc6ICcxLjVyZW0nLFxuICAgIHhsOiAnMnJlbScsXG4gIH0sXG4gIHNoYWRvd3M6IHtcbiAgICBzbTogJzAgMXB4IDJweCByZ2JhKDAsIDAsIDAsIDAuMDUpJyxcbiAgICBtZDogJzAgNHB4IDZweCByZ2JhKDAsIDAsIDAsIDAuMDUpJyxcbiAgICBsZzogJzAgMTBweCAxNXB4IHJnYmEoMCwgMCwgMCwgMC4wNSknLFxuICAgIHhsOiAnMCAyMHB4IDI1cHggcmdiYSgwLCAwLCAwLCAwLjA1KSdcbiAgfSxcbiAgdHlwb2dyYXBoeToge1xuICAgIGZvbnRGYW1pbHk6IHtcbiAgICAgIHByaW1hcnk6ICctYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBcIkhlbHZldGljYSBOZXVlXCIsIEFyaWFsLCBzYW5zLXNlcmlmJyxcbiAgICAgIHNlY29uZGFyeTogJ1wiU0YgUHJvIERpc3BsYXlcIiwgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBcIlNlZ29lIFVJXCIsIFJvYm90bywgc2Fucy1zZXJpZidcbiAgICB9LFxuICAgIGZvbnRTaXplOiB7XG4gICAgICB4czogJzAuNzVyZW0nLFxuICAgICAgc206ICcwLjg3NXJlbScsXG4gICAgICBtZDogJzFyZW0nLFxuICAgICAgbGc6ICcxLjEyNXJlbScsXG4gICAgICB4bDogJzEuMjVyZW0nLFxuICAgICAgJzN4bCc6ICcycmVtJ1xuICAgIH0sXG4gICAgZm9udFdlaWdodDoge1xuICAgICAgcmVndWxhcjogNDAwLFxuICAgICAgbWVkaXVtOiA1MDAsXG4gICAgICBzZW1pYm9sZDogNjAwLFxuICAgICAgYm9sZDogNzAwLFxuICAgIH0sXG4gIH0sXG4gIGJvcmRlclJhZGl1czoge1xuICAgIHNtOiAnMC4yNXJlbScsXG4gICAgbWQ6ICcwLjVyZW0nLFxuICAgIGxnOiAnMXJlbScsXG4gICAgeGw6ICcycmVtJyxcbiAgICBmdWxsOiAnOTk5OXB4J1xuICB9LFxuICBmb250U2l6ZXM6IHtcbiAgICB4czogJzAuNzVyZW0nLFxuICAgIHNtOiAnMC44NzVyZW0nLFxuICAgIG1kOiAnMXJlbScsXG4gICAgbGc6ICcxLjEyNXJlbScsXG4gICAgeGw6ICcxLjI1cmVtJyxcbiAgICAnMnhsJzogJzEuNXJlbScsXG4gICAgJzN4bCc6ICcycmVtJyxcbiAgICAnNHhsJzogJzIuNXJlbSdcbiAgfSxcbiAgZm9udFdlaWdodHM6IHtcbiAgICByZWd1bGFyOiA0MDAsXG4gICAgbWVkaXVtOiA1MDAsXG4gICAgc2VtaWJvbGQ6IDYwMCxcbiAgICBib2xkOiA3MDAsXG4gIH0sXG4gIHpJbmRpY2VzOiB7XG4gICAgc3RpY2t5OiAxMDAsXG4gICAgZG9ja2VkOiAxMCxcbiAgICBkcm9wZG93bjogMTAwMCxcbiAgICBvdmVybGF5OiAyMDAwXG4gIH0sXG4gIHRyYW5zaXRpb25zOiB7XG4gICAgYmFzZTogJzAuM3MgZWFzZS1pbi1vdXQnLFxuICAgIGZhc3Q6ICcwLjE1cyBlYXNlLWluLW91dCdcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgdGhlbWU7ICJdLCJuYW1lcyI6WyJ0aGVtZSIsImNvbG9ycyIsInByaW1hcnkiLCJwcmltYXJ5RGFyayIsInNlY29uZGFyeSIsInN1Y2Nlc3MiLCJ3YXJuaW5nIiwiZXJyb3IiLCJpbmZvIiwiYWNjZW50IiwidGV4dCIsImRhcmsiLCJsaWdodCIsImdyYXkiLCJtdXRlZCIsInRleHRMaWdodCIsImJhY2tncm91bmQiLCJiYWNrZ3JvdW5kMiIsImJvcmRlciIsImRlZmF1bHQiLCJzdGF0dXMiLCJncmFkaWVudCIsImJyZWFrcG9pbnRzIiwic20iLCJtZCIsImxnIiwieGwiLCJzcGFjaW5nIiwieHMiLCJzaGFkb3dzIiwidHlwb2dyYXBoeSIsImZvbnRGYW1pbHkiLCJmb250U2l6ZSIsImZvbnRXZWlnaHQiLCJyZWd1bGFyIiwibWVkaXVtIiwic2VtaWJvbGQiLCJib2xkIiwiYm9yZGVyUmFkaXVzIiwiZnVsbCIsImZvbnRTaXplcyIsImZvbnRXZWlnaHRzIiwiekluZGljZXMiLCJzdGlja3kiLCJkb2NrZWQiLCJkcm9wZG93biIsIm92ZXJsYXkiLCJ0cmFuc2l0aW9ucyIsImJhc2UiLCJmYXN0Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./styles/theme.ts\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/head");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "styled-components":
/*!************************************!*\
  !*** external "styled-components" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("styled-components");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();