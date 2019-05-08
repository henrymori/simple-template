class TemplateEngine {
    constructor({ template = "", options = {}, filters = {} }) {
        this._template = template;
        this._options = options;
        this._filters = filters;
        this._hasCompiled = false;
        this._defaultCode = "let a = [];\n";
        this._code = this._defaultCode;
        this._delimiterRegex = new RegExp(/<%(.+?)%>/g);
        this._logicRegex = new RegExp(/(if|for|else|let|var|{|})/g);
    }

    _addLine({ line, isJS = false }) {
        if (line.length === 0) return;
        else if(isJS === true) {
            if (!line.includes("||") && !!line.includes("|")) {
                const split = line.split('|');
                // if  "bananas | upperCase" is split on |, then split[0] = the value to apply the filter function to and split[1] trimmed is the name of the function to pull out of the _filters property
                const func = this._filters[split[1].trim()];
                if (!func) return;
                this._code += `a.push("${func(split[0].trim())}");\n`;    
            } else {
                if(line.match(this._logicRegex)) {
                    this._code += `${line}\n`;
                } else {
                    this._code += `a.push(${line});\n`;
                }
            }
        } else {
            // non-js code, just push to 'a' array as a string
            this._code += `a.push("${line.replace(/"/g, '\\"')}");\n`;
        }
    }

    _compile() {
        // where the template is broken down into sections dependent on the current delimiter location and the cursor position from prior iterations
        let _match = null,
        cursor = 0;
        while(_match = this._delimiterRegex.exec(this._template)) {
            // add non-js static text
            this._addLine({ line: this._template.slice(cursor, _match.index) });
            //  and then the js code
            this._addLine({ line: _match[1], isJS: true });
            cursor = _match.index + _match[0].length;
        }
        // add any remaning non-js logic to the end of _code
        this._addLine({ line: this._template.slice(cursor, this._template.length) });
    }

    render({ options = {}, filters = {} }) {
        if(Object.keys(options).length > 0 || Object.keys(filters).length > 0) {
            this._options = Object.assign(this._options, options);
            this._filters = Object.assign(this._filters, filters);
            this._hasCompiled = false;
            this._code = this._defaultCode;
        }
        if(this._hasCompiled === false) {
            this._compile();
            this._hasCompiled = true;
        }
        this._code += `return a.join("");\n`
        // console.log(this._code);
        return new Function(`with (this){ ${this._code} }`).apply(this._options);
    }
}

module.exports = TemplateEngine;