// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import { UserRepository } from "../repositories";
import { getJsonSchemaRef } from "@loopback/repository-json-schema";
import { repository } from "@loopback/repository";
import { User } from "../models";
import {
  requestBody,
  post,
  get
} from "@loopback/rest";
import * as _ from "lodash";
import { validateCredentials } from "../services/email.validator";
import { BcryptHasher } from "../services/hash.password.bcrypt";
import {inject} from '@loopback/core';
import {Credentials} from "../repositories/user.repository";
import {CredentialsRequestBody} from "./specs/user.controller.spec"
import {MyUserService} from "../services/user.service"
import {JWTService} from "../services/jwt.service";
import {
  TokenServiceBindings,
  PasswordHasherBindings,
  UserServiceBindings,
} from "../keys";

export class UserController {
  constructor(@repository(UserRepository) public userRepository: UserRepository,
              @inject(PasswordHasherBindings.PASSWORD_HASHER) public hasher: BcryptHasher,
              @inject(UserServiceBindings.USER_SERVICE) public userService: MyUserService,
              @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: JWTService,
              // @inject("service.hasher") public hasher: BcryptHasher,
              // @inject("service.user.service") public userService: MyUserService,
              // @inject("service.jwt.service") public jwtService: JWTService,
            ) {}

  @post('/register', {
    responses: {
      '200':{
        description: 'User',
        content: {
          schema: getJsonSchemaRef(User),
        },
      },
    },
  })
  async register(@requestBody() userData: User){
    validateCredentials(_.pick(userData, ['email','password']));
    // the pick function picks the specified fields from the object

    userData.password = await this.hasher.hashPassword(userData.password);
    const savedUser = await this.userRepository.create(userData);
    delete savedUser.password; // to not return the user password in the response
    return savedUser;
  }

  @post('/login', {
    responses: {
      "200": {
        description: "Token",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties:{
                token:{
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  })
  async login(@requestBody(CredentialsRequestBody) credentials: Credentials): Promise<{token:string}>{
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = await this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return Promise.resolve({token});
  }


  //@authenticate('jwt')
  @get('/users/me')
  async protectedFunc() {
    return "PROTECTED FUNCTION!";
  }

}
