FROM fedora:29

RUN dnf -y upgrade \
    && \
    dnf -y install \
        iproute \
        nodejs \
        git
