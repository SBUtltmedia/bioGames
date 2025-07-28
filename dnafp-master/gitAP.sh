#!/bin/bash
git config --global user.name "APeitzsch"
git config --global user.email agpeitzsch@gmail.com
git add .
git commit -m "$1"
git push
