


mplayer -ao null $1 -vo jpeg:outdir=$1-dir
convert $1-dir/* ./$1.gif
