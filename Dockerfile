FROM alpine:latest
EXPOSE 80
ENV APP_DIR=/opt/app 
COPY ./dist $APP_DIR
RUN mkdir -p $APP_DIR/img
COPY ./img $APP_DIR/img
RUN chmod +x $APP_DIR/bin/start

WORKDIR $APP_DIR

CMD ["./bin/start", "80", "app/"]
