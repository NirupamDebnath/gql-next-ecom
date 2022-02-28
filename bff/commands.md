1. npm i -g typescript
2. npm init -y
3. npm i typescript @types/node ts-node ts-node-dev -D
4. npm i express dotenv
5. tsc --init
6. tsconfig add
   "exclude": [
   "node_modules"
   ]

7. npm run typeorm:cli -- migration:generate -n <migration name>
8. npm run typeorm:cli -- migration:run
9. npm run typeorm:cli -- migration:revert
