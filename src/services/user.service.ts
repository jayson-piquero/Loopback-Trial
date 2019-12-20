import { UserService } from "@loopback/authentication";
import { Credentials } from "../repositories/user.repository";
import { User } from "../models";
import {inject} from '@loopback/core';
import { UserRepository } from "../repositories/user.repository";
import {HttpErrors} from '@loopback/rest';
import {BcryptHasher} from "./hash.password.bcrypt";
import { repository } from "@loopback/repository";
import {securityId} from '@loopback/security';
//mport {UserProfile} from "@loopback/security";
import {PasswordHasherBindings} from "../keys";


export class MyUserService implements UserService<User, Credentials>{
  constructor(@repository(UserRepository) public userRepository: UserRepository,
              @inject(PasswordHasherBindings.PASSWORD_HASHER) public hasher: BcryptHasher,
              // @inject("service.hasher") public hasher: BcryptHasher,
            ){}

  async verifyCredentials(credentials: Credentials): Promise<User>{

    const foundUser = await this.userRepository.findOne({
      where:{
        email: credentials.email
      }
    });

    if (!foundUser){
      throw new HttpErrors.Unauthorized("User not Found!");
    }
    // console.log(`Entered Password: ${credentials.password}`);
    // console.log(`Found Password: ${foundUser.password}`);
    const passwordMatched = await this.hasher.comparePassword(credentials.password, foundUser.password)

    if (!passwordMatched){
      throw new HttpErrors.Unauthorized("Incorrect Password!");
    }

    return foundUser;

  }

  convertToUserProfile(user: User): import("@loopback/security").UserProfile{
    let userName="";
    let securityID="";
    if(user.firstName){
      userName = user.firstName;
    }
    if (user.lastName){
      userName = user.firstName?`${user.firstName} ${user.lastName}` : user.lastName;
    }
    securityID = user.id.toString();
    return {email: `${user.email}`,[securityId]: securityID,name:userName};
  }
}
