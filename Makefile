work:
	emacs -nw src/* README.org *.html
clean:
	rm -f ./*~
	rm -f ./src/*~
add: clean
	git add -A :/
commit:
	git commit -a
FORCE:
