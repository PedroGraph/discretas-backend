require ('dotenv').config();
const mongoose =require('mongoose');
const { DB_HOST, DB_USER ,DB_PASSWORD}=process.env;
const uri= `mongodb+srv://pedro:peter@develomentgraph.gmztlrt.mongodb.net/Discretas?retryWrites=true&w=majority`;
const conectarDB =async () =>{ 
try{
await mongoose.connect (uri, { useNewUrlParser:true,useUnifiedTopology:true});

console.log('conexión exitosa a mongoDB');
}catch (err){
    console.log('Error al conectar mongoDB: ',err);
    process.exit(1);
}
};
module.exports=conectarDB;
