FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json server/package.json
COPY client/package.json client/package.json
COPY agent/package.json agent/package.json

RUN npm ci --workspaces --include-workspace-root

COPY . .

WORKDIR /app/server
EXPOSE 4000

CMD ["npm", "run", "start"]
