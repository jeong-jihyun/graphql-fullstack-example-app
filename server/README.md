### create

```mkdir server
cd server
```

create package.json

```yarn init -y -p
yarn add express apollo-server-express graphql reflect-metadata typescript apollo-server-core
yarn add ts-node
yarn add --dev nodemon
```

dev package.json

```"dev": "nodemon --watch *.ts --exec ts-node src/index.ts"

```

TypeGraphQL install

```
yarn add type-graphql
```

typorm database connection

```
yarn add typeorm pg
npx typeorm init --name MyProject --database postgres

```

typeorm database mysql change

```
yarn add mysql2
```

user resolver

```
yarn add class-validator argon2
```

Login

```
yarn add nanoid jsonwebtoken
yarn add --dev @types/nanoid @types/jsonwebtoken
```

redis

```
yarn add ioredis
yarn add --dev @types/ioredis
```

docker redis 확인

```
docker exec -it redis-container /bin/bash
redis-cli
```

액세스 토큰 새로고침하기

```
yarn add cookie-parser
yarn add --dev @types/cookie-parser
```

데이터로더 추가

```
yarn add dataloader
```

graphql-upload 설치

```
yarn add graphql-upload
yarn add --dev @types/graphql-upload
```
