export type ConfigAppProviderType = {
  hostname: string;
  main_hostname: string;
  database: {
    connection: string;
    username: string;
    password: string;
    authSource: string;
  };
  jwt: {
    secretKey: string;
    expires: number;
  };
  opsKey: string;
  node_env: 'production' | 'development';
  origin: RegExp;
  bcrypt: {
    round: number;
  };
  port: number;
};
