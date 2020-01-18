FROM debian:buster-slim
LABEL name="lighthouse-google-cloud-runn" \
  maintainer="Ronald Jordan <amisword@gmail.com>" \
  version="1.0" \
  description="Lighthouse tool for Google Cloud Run."

# Install deps + add Chrome Stable + purge all the things
RUN apt-get update && apt-get install -y \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg \
  --no-install-recommends \
  && curl -sSL https://deb.nodesource.com/setup_12.x | bash - \
  && curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update && apt-get install -y \
  google-chrome-stable \
  fontconfig \
  fonts-ipafont-gothic \
  fonts-wqy-zenhei \
  fonts-thai-tlwg \
  fonts-kacst \
  fonts-symbola \
  fonts-noto \
  fonts-freefont-ttf \
  nodejs \
  --no-install-recommends \
  && apt-get purge --auto-remove -y curl gnupg \
  && rm -rf /var/lib/apt/lists/*

ARG CACHEBUST=1

# Add Chrome as a user
RUN groupadd -r chrome && useradd -r -g chrome -G audio,video chrome \
  && mkdir -p /home/chrome/app && chown -R chrome:chrome /home/chrome

RUN chmod a+rwx /home/chrome/app

USER chrome

WORKDIR /home/chrome/app

COPY package*.json ./
COPY *.js ./

EXPOSE 8080

RUN npm install

CMD [ "node", "index.js" ]
