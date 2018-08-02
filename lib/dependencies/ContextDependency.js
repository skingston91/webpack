/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const Dependency = require("../Dependency");
const DependencyTemplate = require("../DependencyTemplate");
const CriticalDependencyWarning = require("./CriticalDependencyWarning");

/** @typedef {import("../ModuleGraph")} ModuleGraph */
/** @typedef {import("../WebpackError")} WebpackError */

const regExpToString = r => (r ? r + "" : "");

class ContextDependency extends Dependency {
	// options: { request, recursive, regExp, include, exclude, mode, chunkName, groupOptions }
	constructor(options) {
		super();
		this.options = options;
		this.userRequest = this.options.request;
		/** @type {false | string} */
		this.critical = false;
		this.hadGlobalOrStickyRegExp = false;
		if (this.options.regExp.global || this.options.regExp.sticky) {
			this.options.regExp = null;
			this.hadGlobalOrStickyRegExp = true;
		}
		this.request = undefined;
		this.range = undefined;
		this.valueRange = undefined;
		// TODO refactor this
		this.prepend = undefined;
		// TODO refactor this
		this.replaces = undefined;
	}

	/**
	 * @returns {string | null} an identifier to merge equal requests
	 */
	getResourceIdentifier() {
		return (
			`context${this.options.request} ${this.options.recursive} ` +
			`${regExpToString(this.options.regExp)} ${regExpToString(
				this.options.include
			)} ${regExpToString(this.options.exclude)} ` +
			`${this.options.mode} ${this.options.chunkName} ` +
			`${JSON.stringify(this.options.groupOptions)}`
		);
	}

	/**
	 * Returns warnings
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {WebpackError[]} warnings
	 */
	getWarnings(moduleGraph) {
		let warnings = super.getWarnings(moduleGraph) || [];
		if (this.critical) {
			warnings.push(new CriticalDependencyWarning(this.critical));
		}
		if (this.hadGlobalOrStickyRegExp) {
			warnings.push(
				new CriticalDependencyWarning(
					"Contexts can't use RegExps with the 'g' or 'y' flags."
				)
			);
		}
		return warnings;
	}
}

ContextDependency.Template = DependencyTemplate;

module.exports = ContextDependency;
