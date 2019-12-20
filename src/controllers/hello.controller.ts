// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import {
  get
} from "@loopback/rest";

export class HelloController {
  constructor() {}


  //@authenticate('jwt')
  @get('/users/hello')
  async protectedFunc(): Promise<string> {
    return Promise.resolve("HELLO ZA WARUDO!!");
  }
}
