const sql = require('mssql');

// SQL Server Database Config
const config = 'mssql://blurack:P@ssword123@blurack.database.windows.net/BluRackSQL?encrypt=true';

// SQL Server Database Config
const poolPromise = new sql.ConnectionPool(config)
	.connect()
	.then(pool => {
		console.log('*********** Connected to SQL SERVER *************');
		return pool
})
	.catch(err => console.log('******** Database Connection Failed *************'));

module.exports = {
	sql, poolPromise
};


