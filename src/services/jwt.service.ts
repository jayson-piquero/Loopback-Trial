import {UserProfile} from "@loopback/security";
import {promisify} from "util";
const jwt = require("jsonwebtoken");
const signAsync = promisify(jwt.sign);
// to convert the sign function from callbacks to promises
const verifyAsync = promisify(jwt.verify);
// convert verify function to promises
import {HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
import {securityId} from '@loopback/security';
import {TokenServiceConstants} from "../keys";

export class JWTService{

  @inject(TokenServiceConstants.TOKEN_SECRET_VALUE)
  public readonly secret: string;
  @inject(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE)
  public readonly jwtExpiresIn: string;

  // @inject("authenticate.jwt.secret")
  // public readonly secret: string;
  // @inject("authenticate.jwt.expiresIn")
  // public readonly jwtExpiresIn: string;

  async generateToken(userProfile:UserProfile): Promise<string>{
    if(!userProfile){
      throw new HttpErrors.Unauthorized("Error while generating token: User Profile is null");
    }
    let token = "";
    try{
      token = await signAsync(userProfile, this.secret,{
        expiresIn:this.jwtExpiresIn
      })
    } catch(err){
      throw new HttpErrors.Unauthorized(`Error Generating Token ${err}`);
    }
    return token;
  }


  async verifyToken(token: string): Promise<UserProfile>{
    if (!token){
      throw new HttpErrors.Unauthorized("Error verifying token: 'token' is null.");
    }
    let userProfile: UserProfile;
    try{
      const decryptedToken = await verifyAsync(token,this.secret);

      // console.log(`Email: ${decryptedToken.email}\nName: ${decryptedToken.name}\n`);
      userProfile = Object.assign(
        {email: "", name:"", [securityId]:""},
        {email:decryptedToken.email, name: decryptedToken.name, [securityId]:"1"}//decryptedToken.[securityId]},
      );
    } catch(error){
      throw new HttpErrors.Unauthorized(`Error verifying token : ${error.message}`);
    }
    // return Promise.resolve({email:"ss.ronnin@gmail.com",[securityId]:"1",name:"Ronello Ninettu"});
    return userProfile;
  }
}
