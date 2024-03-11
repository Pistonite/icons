docker:
    rustup default stable
    cross build --release --target x86_64-unknown-linux-musl
    npm run build
    docker build -t pistonite/icons . --no-cache
    @echo "Run with:"
    @echo
    @echo "docker run -p 8000:80 pistonite/icons"
