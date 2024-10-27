FROM alpine:latest
EXPOSE 80
ENV APP_DIR=/iconss
COPY ./dist $APP_DIR
RUN chmod +x $APP_DIR/bin/iconss

WORKDIR $APP_DIR

ENV ICONSS_LOG=info                    \
    ICONSS_LOG_COLOR=false             \
    ICONSS_APP_PATH=/iconss/app        \
    ICONSS_ICON_PATH=/iconss/img       \
    ICONSS_PORT=80


ENTRYPOINT ["/iconss/bin/iconss"]
