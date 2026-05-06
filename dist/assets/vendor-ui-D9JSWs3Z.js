import{a as R,b as O,g as v}from"./vendor-react-BfzjdGTP.js";var m={exports:{}},_={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var d;function E(){if(d)return _;d=1;var n=R(),s=Symbol.for("react.element"),o=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,u=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,f={key:!0,ref:!0,__self:!0,__source:!0};function p(a,t,c){var e,i={},l=null,y=null;c!==void 0&&(l=""+c),t.key!==void 0&&(l=""+t.key),t.ref!==void 0&&(y=t.ref);for(e in t)r.call(t,e)&&!f.hasOwnProperty(e)&&(i[e]=t[e]);if(a&&a.defaultProps)for(e in t=a.defaultProps,t)i[e]===void 0&&(i[e]=t[e]);return{$$typeof:s,type:a,key:l,ref:y,props:i,_owner:u.current}}return _.Fragment=o,_.jsx=p,_.jsxs=p,_}var x;function b(){return x||(x=1,m.exports=E()),m.exports}var j=b();function S(n,s){var o={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&s.indexOf(r)<0&&(o[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var u=0,r=Object.getOwnPropertySymbols(n);u<r.length;u++)s.indexOf(r[u])<0&&Object.prototype.propertyIsEnumerable.call(n,r[u])&&(o[r[u]]=n[r[u]]);return o}function q(n,s,o,r){function u(f){return f instanceof o?f:new o(function(p){p(f)})}return new(o||(o=Promise))(function(f,p){function a(e){try{c(r.next(e))}catch(i){p(i)}}function t(e){try{c(r.throw(e))}catch(i){p(i)}}function c(e){e.done?f(e.value):u(e.value).then(a,t)}c((r=r.apply(n,s||[])).next())})}var w=O();const D=v(w);export{D as R,q as _,S as a,j};
