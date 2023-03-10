declare namespace Express {
  type User = import('../lib/user/user_model').UserDoc
}

declare namespace Express {
  interface Request {
    user: import('../lib/user/user_model').UserDoc
  }
}
