# =================
# Runtime Image
FROM alpine:latest
EXPOSE 80
ENV APP_DIR=/opt/app 
RUN mkdir -p $APP_DIR
# Copy outputs from builders
COPY ./target/x86_64-unknown-linux-musl/release/start $APP_DIR/start
COPY ./target/frontend $APP_DIR/dist
COPY ./img $APP_DIR/img

WORKDIR $APP_DIR

CMD ["./start", "80", "dist/"]
