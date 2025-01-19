FROM node:18
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libcups2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxi6 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libgtk-3-0 \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libcurl4 \
    libsecret-1-0 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

