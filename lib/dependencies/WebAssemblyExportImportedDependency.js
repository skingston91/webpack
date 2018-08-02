/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const DependencyReference = require("./DependencyReference");
const ModuleDependency = require("./ModuleDependency");

/** @typedef {import("../ModuleGraph")} ModuleGraph */

class WebAssemblyExportImportedDependency extends ModuleDependency {
	constructor(exportName, request, name) {
		super(request);
		/** @type {string} */
		this.exportName = exportName;
		/** @type {string} */
		this.name = name;
	}

	/**
	 * Returns the referenced module and export
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {DependencyReference} reference
	 */
	getReference(moduleGraph) {
		const module = moduleGraph.getModule(this);
		if (!module) return null;
		return new DependencyReference(
			() => moduleGraph.getModule(this),
			[this.name],
			false
		);
	}

	get type() {
		return "wasm export import";
	}
}

module.exports = WebAssemblyExportImportedDependency;
