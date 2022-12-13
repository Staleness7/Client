#!/bin/bash

for ((i=0; i<=23; ++i)); do
	width=`identify $i.png | awk '{print $3}' | tr 'x' ' ' | awk '{print $1}'`
	height=`identify $i.png | awk '{print $3}' | tr 'x' ' ' | awk '{print $2}'`
	count=$((width/100))
	if [ ! -d ${i} ]; then
		echo mkdir ${i}
		mkdir ${i}
	fi
	cp ${i}_se.png ${i}
	cp ${i}.json ${i}
	for ((j=0; j<$count; ++j)); do
		echo convert $i.png -crop 100x100+$((j*100))+0 ${i}/${j}.png
		convert $i.png -crop 100x100+$((j*100))+0 ${i}/${j}.png
	done
done
