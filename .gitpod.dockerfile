FROM gitpod/workspace-full
USER gitpod

RUN curl https://sh.rustup.rs -sSf | sh -s -- --default-toolchain stable -y && \
    wget https://github.com/cargo-generate/cargo-generate/releases/download/v0.9.0/cargo-generate-v0.9.0-x86_64-unknown-linux-musl.tar.gz && \
    tar -C ~/.cargo/bin/ -xzf cargo-generate-v0.9.0-x86_64-unknown-linux-musl.tar.gz && \ 
    rm cargo-generate-v0.9.0-x86_64-unknown-linux-musl.tar.gz 
