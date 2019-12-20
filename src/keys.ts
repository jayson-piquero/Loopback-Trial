import {BindingKey} from "@loopback/core";
import {TokenService,UserService} from "@loopback/authentication";
import {PasswordHasher} from "./services/hash.password.bcrypt";
import {Credentials} from "./repositories/user.repository"
import {User} from "./models/user.model";

export namespace TokenServiceConstants{
  export const TOKEN_SECRET_VALUE = 'MaA@4YiyIySsZ3eEcCkKRRreYiGghtTK3iyYhH';
  export const TOKEN_EXPIRES_IN_VALUE = '7h';
}

export namespace TokenServiceBindings{
  export const TOKEN_SECRET = BindingKey.create<string>(
    "authentication.jwt.secret"
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    "authentication.jwt.expiresIn"
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    "service.jwt.service"
  );
}

export namespace PasswordHasherBindings{
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    "service.hasher"
  );
  export const ROUNDS = BindingKey.create<number>("service.hasher.rounds");
}

export namespace UserServiceBindings{
  export const USER_SERVICE = BindingKey.create<UserService<Credentials,User>>(
    "service.user.service"
  );
}
