#!/bin/bash
podman build -f poll.Dockerfile -t gcr.io/essintial-tech-helper/poll .
podman build -f server.Dockerfile -t gcr.io/essintial-tech-helper/server .
