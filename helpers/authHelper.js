import bcrypt from 'bcrypt'

export const hashPassword = async (Password) => {
    try{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }
};
export const comparePassword = async (Password, hashedPassword) => {
  return bcrypt.compare(Password, hashedPassword);
};