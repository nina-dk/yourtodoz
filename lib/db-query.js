const { Client } = require("pg");

const logQuery = (statement, params) => {
  let timeStamp = new Date();
  let formattedTimeStamp = timeStamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement, params);
};

module.exports = {
  async dbQuery(statement, ...params) {
    let client = new Client({
      host: "/var/run/postgresql",
      user: "ninadk",
      database: "todo-lists"
    });

    await client.connect();
    logQuery(statement, params)
    let result = await client.query(statement, params);
    await client.end();

    return result;
  }
};