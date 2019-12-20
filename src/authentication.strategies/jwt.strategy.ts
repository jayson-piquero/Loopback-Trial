import {
  AuthenticationStrategy,
} from "@loopback/authentication";
import {
  Request,
  HttpErrors,
} from "@loopback/rest";
import {
  JWTService,
} from "../services/jwt.service";
import {UserProfile} from "@loopback/security";
import {inject} from '@loopback/core';
import {TokenServiceBindings} from "../keys";

export class JWTStrategy implements AuthenticationStrategy{
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: JWTService,
    // @inject("service.jwt.service") public jwtService: JWTService,
  ){

  }
  name: string = 'jwt';
  async authenticate(request: Request): Promise<UserProfile | undefined>{
    const token: string = this.extractCredentials(request);
    const userProfile = await this.jwtService.verifyToken(token);
    return Promise.resolve(userProfile)
  }

  extractCredentials(request: Request): string{
    if(!request.headers.authorization){
      throw new HttpErrors.Unauthorized("Authorization header is missing!");
    }

    const authHeaderValue = request.headers.authorization;

    // authorization : Bearer cdsfwfesdTOKENVALUEasdqdw

    if(!authHeaderValue.startsWith('Bearer')){
      throw new HttpErrors.Unauthorized("Authorization header is not of type Bearer!");
    }

    const parts = authHeaderValue.split(" ");
    if (parts.length !== 2){
      throw new HttpErrors.Unauthorized(
        "Authorization header has too many parts! It must follow this pattern 'Bearer xxx.yyy.zzz...'");
    }
    const token = parts[1];
    return token;
  }
}
