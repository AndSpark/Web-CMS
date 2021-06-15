import { getConnectionManager } from 'typeorm';
import { Db } from './db'


const dbs = {
	dbList:[],
	async createDb(sitetplpath:string) {
		const sitePath = sitetplpath.match(/\/Sites\/.*?\//)[0];
		const name = sitePath.replace(/\/Sites\/|\//g, '');
		let db:Db = this.dbList.find((v) => name === v.name);

		let dbExists = getConnectionManager().has(name) && getConnectionManager().get(name).isConnected

		if (db && dbExists) {
			clearTimeout(db.timeout)
			db.timeout = setTimeout(async () => {
				await this.closeDb(name)

			}, 120000);
			return db
		}

		if (db) {
			clearTimeout(db.timeout)
			await this.closeDb(name)

		}

		db = new Db(sitetplpath)
		await db.linkDb()
		db.timeout = setTimeout(async () => {
			await this.closeDb(name)
		}, 120000);
		this.dbList.push(db)
		return db
	},
	async closeDb(name: string) {
		this.dbList = this.dbList.filter(db => db.name !== name)
		try {
		await getConnectionManager().get(name).close()
		} catch (error) {
			console.log('closeDbError');
		}
	}
}

export  {dbs}