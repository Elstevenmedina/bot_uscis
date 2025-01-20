FROM node:18

# Instalar dependencias necesarias para Puppeteer y Xvfb
RUN apt-get update && apt-get install -y \
    xvfb \
    libnss3 \
    libatk1.0-0 \
    libcups2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxi6 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
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
    dbus-x11 \
    libxcb-dri3-0 \
    libxshmfence1 \
    libxrender1 \
    libxext6 \
    libxfixes3 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Configurar la variable de entorno DISPLAY
ENV DISPLAY=:99
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 3000

# Ejecutar Xvfb y la aplicación
CMD ["sh", "-c", "Xvfb :99 -screen 0 1280x1024x24 & npm start"]
