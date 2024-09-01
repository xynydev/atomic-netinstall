ARG FEDORA_VERSION=40

FROM registry.fedoraproject.org/fedora:${FEDORA_VERSION} as builder

COPY . /src
RUN cd /src && dnf install -y pnpm && \
    pnpm install && pnpm build:linux && \
    mkdir /out && tar xf ./dist/*.tar.xz && mv netinstall*/ /out/netinstall

FROM quay.io/fedora-ostree-desktops/base:${FEDORA_VERSION}

COPY --from=builder /out/netinstall /usr/share/netinstall
COPY netinstall-config.json /usr/share/netinstall/netinstall-config.json
COPY imageroot /
RUN curl -Lo /usr/bin/tuigreet https://github.com/apognu/tuigreet/releases/download/0.9.1/tuigreet-0.9.1-x86_64 && chmod +x /usr/bin/tuigreet \
    rpm-ostree install greetd cage && systemctl enable greetd && ostree container commit
