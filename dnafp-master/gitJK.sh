#!/bin/bash
git config --global user.name "joochan0113"
git config --global user.email joochan0113@gmail.com
git add .
git commit -m "$1"
git push
