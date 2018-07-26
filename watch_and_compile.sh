#!/bin/bash

while [ true ]
do
    find_res=`find . -newer watch_checkpoint`
    find_exit=$?
    if [ $find_exit == 1 ] || [ -n "$find_res" ]; then
        printf "[$(date '+%H:%M:%S')] "
        ./compile.py
    fi
    touch watch_checkpoint
    sleep 2
done
