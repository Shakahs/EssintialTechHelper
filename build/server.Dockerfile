FROM node:12-stretch

COPY backend/server.js /app/server.js
COPY frontend/ /app/static/

CMD ["node","/app/server.js"]
