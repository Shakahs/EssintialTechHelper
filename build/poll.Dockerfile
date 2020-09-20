FROM node:12-stretch

COPY backend/poll.js /app/poll.js
CMD ["node","/app/poll.js"]
