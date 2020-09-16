FROM node:12-stretch

COPY build/backend/poll.js /var/EssintialTechHelper/poll.js
CMD ["node","/var/EssintialTechHelper/poll.js"]
