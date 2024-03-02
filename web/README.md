start

```
npx create-react-app --template @chakra/typescript web
cd web
yarn start
```

설치

```
yarn add react-waypoint
yarn add @apollo/client graphql
yarn add --dev @graphql-codegen/cli
yarn add --dev @graphql-codegen/typescript
yarn add --dev @graphql-codegen/typescript-operations
yarn add --dev @graphql-codegen/typescript-react-apollo
yarn add --dev @graphql-codegen/add
```

create codegen.yml

```
overwrite: true
schema: 'http://localhost:4000/graphql'
documents: 'src/**/*.graphql'
generates:
  src/generated/graphql.tsx:
    plugins:
      - 'typescript'
      - 'typescript-operations'
      - 'typescript-react-apollo'
```

pakage.json codegen add

```
"codegen" : "graphql-codegen --config codegen.yml"
yarn codegen
```

pagination 처리

```
yarn add react-waypoint
```

페이지 처리

```
yarn add react-router-dom
```

이미지 최적화

```
yarn add react-lazyload
yarn add --dev @types/react-lazyload
```

https://chakra-ui.com/ 해당UI에 대해서 적용 방안에 대해서는 chakra-ui확인 필요

1. createApolloCache 정리

- InMemoryCache를 활용 방안을 확인
