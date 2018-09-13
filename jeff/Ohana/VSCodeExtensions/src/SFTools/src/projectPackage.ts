'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as gist from '../more-@types/gist-package-json';


export default class ProjectPackage {
	private static _instance: ProjectPackage = new ProjectPackage();
	private _projectPackage: gist.IPackage;


	constructor() {
		if(ProjectPackage._instance) {
			throw new Error("Error: Instantiation failed, use SingletonClass.getInstance() instead of new!");
		}

		ProjectPackage._instance = this;

		// Could also use the read-pkg or read-pkg-up node packages
		let packageJson: string = fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8");
		ProjectPackage._instance._projectPackage = JSON.parse(packageJson);
	}

	public static getInstance(): ProjectPackage {
		return ProjectPackage._instance;
	}

	public get projectPackage(): gist.IPackage {
		return this._projectPackage;
	}

	public static get customSettings() {
		return ProjectPackage._instance._projectPackage.customSettings;
	}
}
