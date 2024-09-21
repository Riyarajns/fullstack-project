import mongoose from "mongoose";
import colors from "colors";
//mongoose connection
const connectDB = async () => {
    try{
      const conn = await mongoose.connect(process.env.MONGO_URL);
      console.log(
        `Connected TO Mongodb Databse ${conn.connection.host}`.bgMagenta.white
      )
    } catch (error){
        console.log(`Error in Mongodb ${error}`.bgRed.white);
    }
}
export default connectDB;