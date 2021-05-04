import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router} from 'react-router-dom';

let child = document.createElement("script");
child.type = "text/javascript";
child.innerHTML = "" +
    "// Single Page Apps for GitHub Pages\n" +
    "// MIT License\n" +
    "// https://github.com/rafgraph/spa-github-pages\n" +
    "// This script checks to see if a redirect is present in the query string,\n" +
    "// converts it back into the correct url and adds it to the\n" +
    "// browser's history using window.history.replaceState(...),\n" +
    "// which won't cause the browser to attempt to load the new url.\n" +
    "// When the single page app is loaded further down in this file,\n" +
    "// the correct url will be waiting in the browser's history for\n" +
    "// the single page app to route accordingly.\n" +
    "(function(l) {\n" +
    "  if (l.search[1] === '/' ) {\n" +
    "    var decoded = l.search.slice(1).split('&').map(function(s) { \n" +
    "      return s.replace(/~and~/g, '&')\n" +
    "    }).join('?');\n" +
    "    window.history.replaceState(null, null,\n" +
    "        l.pathname.slice(0, -1) + decoded + l.hash\n" +
    "    );\n" +
    "  }\n" +
    "}(window.location))";
document.getElementById('root').appendChild(child);

ReactDOM.render(
    <Router>
        <App/>
    </Router>,
    document.getElementById('root')
);

registerServiceWorker();


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
