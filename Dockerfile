FROM knjcode/rpi-node-armv7:latest

WORKDIR /app
COPY . /app
RUN npm install

CMD ["npm", "start"]
