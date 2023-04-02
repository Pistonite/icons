FROM python:3.10

WORKDIR /opt/app
# Copy static files
COPY ./build /opt/app/build
# Copy server files
COPY ./service /opt/app/service
# Copy assets
COPY ./srcimg /opt/app/srcimg
# Copy requirements
COPY ./requirements.txt /opt/app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /opt/app/requirements.txt

CMD ["uvicorn", "service.main:app", "--host", "0.0.0.0", "--port", "80"]
