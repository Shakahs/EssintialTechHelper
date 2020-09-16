#!/bin/bash
(cd ./packages/backend; yarn backend-build)
podman build -f poll.Dockerfile -t eth/poll
