import mysql from 'mysql'

const db_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

var connection

/* istanbul ignore next */
function handleDisconnect() {
  connection = mysql.createConnection(db_config)

  connection.connect(err => {
    if(err) {
      console.error('error when connecting to db:', err)
      setTimeout(handleDisconnect, 2000);
    }
  })

  connection.on('error',err => {
    console.error('db error', err)
    console.log(err.fatal); // true
    console.log('db error code',err.code);

    //- The server close the connection.
    if(err.code === "PROTOCOL_CONNECTION_LOST"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        handleDisconnect();
    }

    //- Connection in closing
    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        //handleDisconnect();
        //connection.connect();
    }

    //- Fatal error : connection variable must be recreated
    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        //  connection.end();
          //handleDisconnect();
    }

    //- Error because a connection is already being established
    else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
    }

    //- Anything else
    else{
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
      //  handleDisconnect();
    }
  })
}

handleDisconnect()

export {connection,handleDisconnect}
