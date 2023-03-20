# nestjs-admin-template

## Requirement

* Nodejs > 14

## How to run

### development
```bash
yarn dev
```

### Production
```bash
yarn prod
```

### Build
```bash
yarn build
```

## Documents
- [AdminJS Getting Started](https://docs.adminjs.co/tutorial-installation-instructions.html)
- [AdminJS Docs](https://docs.adminjs.co/index.html)
- [AdminJS Test App](https://github.com/SoftwareBrothers/adminjs-example-app)
  
## Adding Resources

1. Goto `src/adminjs/resources`
2. Add Resource (Maybe Prisma, Maybe Custom)
3. END :I

## Template

### [Prisma Database](https://github.com/SoftwareBrothers/adminjs-example-app/blob/master/src/sources/prisma/resources/post.resource.ts)
```typescript
import { dmmf, client } from "@/prisma/dmmf";

export const CreatePostResource = () => ({
  resource: {
    model: dmmf.modelMap.Post,
    client,
  },
  features: [],
  options: {
    properties: {
      content: { type: 'richtext' },
      someJson: { type: 'mixed', isArray: true },
      'someJson.number': { type: 'number' },
      'someJson.string': { type: 'string' },
      'someJson.boolean': { type: 'boolean' },
      'someJson.date': { type: 'datetime' },
    },
  },
});
```

### [Custom Databse](https://github.com/SoftwareBrothers/adminjs-example-app/blob/master/src/sources/rest/crypto-database.ts)

TL;DR

저기 위에 있는 링크 따라가서 코드 구조 가져오면 됨
