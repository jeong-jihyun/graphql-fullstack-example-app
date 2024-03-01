create

```
mkdir server
cd server
```

create package.json

```
yarn init -y -p
yarn add express apollo-server-express graphql reflect-metadata typescript apollo-server-core
yarn add ts-node
yarn add --dev nodemon
```

dev package.json

```
"dev": "nodemon --watch *.ts --exec ts-node src/index.ts"
```

TypeGraphQL install

```
yarn add type-graphql
```
